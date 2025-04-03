const queries = require("../queries/orderQueries");
const productQueries = require("../queries/productQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");

const placeOrder = asyncHandler(async (req, res) => {
     // Extract the nested place_order_request first
     const { place_order_request } = req.body;
    
     if (!place_order_request) {
         throwError("Missing place_order_request in request body", 400);
     }
    
    const {
        shipping_details,
        order_items,
        payment_details,
        coupon_code = null,
        order_notes = '',
        language_code = 'en' // Default language is English
    } = place_order_request;

    if (!shipping_details || !order_items || order_items.length === 0 || !payment_details) {
        throwError("Invalid order data", 400);
    }

    // Validate language code
    if (!['en', 'ta'].includes(language_code)) {
        throwError("Invalid language code. Supported languages are 'en' and 'ta'", 400);
    }

    // Start transaction
    await queryAsync('START TRANSACTION');

    try {
        let sub_total = 0;
        let total_discount = 0;

        // Validate all products and calculate totals
        for (const item of order_items) {
            const { product_id, unit_id, quantity, selling_price, mrp } = item;
            if (!product_id || !unit_id || !quantity || !selling_price || !mrp) {
                await queryAsync('ROLLBACK');
                throwError("Missing order item details", 400);
            }

            // Check if product exists and is active
            const product = await queryAsync(queries.getProductById, [language_code, language_code, product_id]);
            if (!product.length || !product[0].is_active) {
                await queryAsync('ROLLBACK');
                throwError(`Product ID ${product_id} not found or inactive`, 400);
            }
          
            // Check if unit exists and has enough stock
            const units = await queryAsync(queries.getProductUnits, [language_code, product_id]);
            const unit = units.find(u => u.unit_id === unit_id);
            if (!unit) {
                await queryAsync('ROLLBACK');
                throwError(`Unit ID ${unit_id} not found for Product ID ${product_id}`, 400);
            }
            
            if (unit.in_stock < quantity) {
                await queryAsync('ROLLBACK');
                throwError(`Insufficient stock for Product ID ${product_id}. Available: ${unit.in_stock}, Requested: ${quantity}`, 400);
            }

            // Calculate totals
            const itemSubTotal = mrp * quantity;
            const itemDiscount = (mrp - selling_price) * quantity;
            
            sub_total += itemSubTotal;
            total_discount += itemDiscount;
        }

           // Calculate order totals with toFixed(2)
    const shipping_cost = 0;
    const tax = (sub_total * 0).toFixed(2);
    const total = (sub_total + shipping_cost + parseFloat(tax) - total_discount).toFixed(2);
    sub_total = sub_total.toFixed(2);
    total_discount = total_discount.toFixed(2);

        // Create the order
        const orderResult = await queryAsync(queries.createOrder, [
            null, // user_id (null for guest orders)
            shipping_details.name,
            shipping_details.mobile_no,
            shipping_details.email || null,
            shipping_details.shipping_address,
            shipping_details.shipping_method,
            sub_total,
            total_discount,
            shipping_cost,
            tax,
            total,
            'processing',
            payment_details.payment_method,
            payment_details.transaction_id || null,
            coupon_code,
            order_notes
        ]);

        const orderId = orderResult.insertId;

        // Add all order items and update inventory
        for (const item of order_items) {
            // Add order item (without product name as it will be in translations)
            const itemSubTotal = item.selling_price * item.quantity;
            const itemDiscount = (item.mrp - item.selling_price) * item.quantity;
            
            const orderItemResult = await queryAsync(queries.addOrderItem, [
                orderId,
                item.product_id,
                item.unit_id,
                item.quantity,
                item.selling_price,
                item.mrp,
                itemSubTotal,
                itemDiscount
            ]);
            
            const orderItemId = orderItemResult.insertId;
            
            // Get product translations for both languages and store them
            const languages = ['en', 'ta'];
            for (const lang of languages) {
                const productTranslation = await queryAsync(queries.getProductTranslation, [
                    lang, 
                    item.product_id
                ]);
                
                if (productTranslation.length > 0) {
                    await queryAsync(queries.addOrderedProductTranslation, [
                        orderItemId,
                        lang,
                        productTranslation[0].name,
                        productTranslation[0].description || null
                    ]);
                }
            }
            
            // Update product stock
            await queryAsync(queries.updateProductStock, [
                item.quantity, 
                item.product_id, 
                item.unit_id
            ]);
        }

        // Record order status history
        await queryAsync(queries.addOrderStatusHistory, [
            orderId, 
            'processing', 
            'Order placed successfully'
        ]);

        // Commit the transaction
        await queryAsync('COMMIT');

        // Get order details with translations based on requested language
        const orderDetails = await getOrderDetails(orderId, language_code);

        // Return success response
        successResponse(res, {
            data: orderDetails,
            message: "Order placed successfully",
            statusCode: 201
        });
    } catch (error) {
        await queryAsync('ROLLBACK');
        console.error("Order placement error:", error);
        throwError(error.message || "Failed to place order", error.statusCode || 500);
    }
});

// Helper function to get complete order details with translations
const getOrderDetails = async (orderId, languageCode = 'en') => {
    // Get basic order information
    const [orderInfo] = await queryAsync(queries.getOrderById, [orderId]);
    
    if (!orderInfo) {
        throwError("Order not found", 404);
    }
    
    // Get order items with translations
    // const orderItems = await queryAsync(queries.getOrderItemsWithTranslations, [orderId, languageCode]);
    const orderItems = await queryAsync(queries.getOrderItemsWithTranslations, 
        [languageCode, languageCode, orderId]);
    
    // Get order status history
    const statusHistory = await queryAsync(queries.getOrderStatusHistory, [orderId]);
    
    return {
        order_id: orderInfo.order_id,
        order_reference: `ORD${orderInfo.order_id}`,
        order_date: orderInfo.order_date,
        order_status: orderInfo.order_status,
        shipping_details: {
            name: orderInfo.name,
            mobile_no: orderInfo.mobile_no,
            email: orderInfo.email,
            shipping_address: orderInfo.shipping_address,
            shipping_method: orderInfo.shipping_method
        },
        order_items: orderItems,
        sub_total: orderInfo.sub_total,
        discount: orderInfo.discount,
        shipping_cost: orderInfo.shipping_cost,
        tax: orderInfo.tax,
        total: orderInfo.total,
        payment_details: {
            payment_method: orderInfo.payment_method,
            transaction_id: orderInfo.transaction_id
        },
        coupon_code: orderInfo.coupon_code,
        order_notes: orderInfo.order_notes,
        status_history: statusHistory
    };
};

// Get orders with pagination
const getOrders = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 10, 
        status,
        language_code = 'en' 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build the query conditions
    let conditions = '';
    const params = [];
    
    if (status) {
        conditions = 'WHERE order_status = ?';
        params.push(status);
    }
    
    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM orders ${conditions}`;
    const [countResult] = await queryAsync(countQuery, params);
    const totalOrders = countResult.total;
    const totalPages = Math.ceil(totalOrders / limit);
    
    // Get orders with pagination
    const orders = await queryAsync(
        queries.getOrdersWithPagination,
        [...params, parseInt(limit), parseInt(offset)]
    );
    
    // Get detailed information for each order
    const ordersWithDetails = [];
    for (const order of orders) {
        const orderItems = await queryAsync(
            queries.getOrderItemsWithTranslations, 
            [language_code, language_code, order.order_id]
        );
       
        
        ordersWithDetails.push({
            ...order,
            order_items: orderItems
        });
    }
    
    successResponse(res, {
        data: {
            orders: ordersWithDetails,
            pagination: {
                total: totalOrders,
                page: parseInt(page),
                limit: parseInt(limit),
                total_pages: totalPages
            }
        },
        message: "Orders retrieved successfully",
        statusCode: 200
    });
});


/// get orders by mobile no.

const getOrdersByMobile = asyncHandler(async (req, res) => {
    const { mobile_no, language_code = 'en' } = req.body;

    if (!mobile_no) {
        throwError("Missing mobile_no in request query", 400);
    }

    // Get orders for the given mobile number
    const orders = await queryAsync(queries.getOrdersByMobile, [mobile_no]);

    if (orders.length === 0) {
        throwError("No orders found for the provided mobile number", 404);
    }

    // Get detailed information for each order
    const ordersWithDetails = [];
    for (const order of orders) {
        const orderItems = await queryAsync(
            queries.getOrderItemsWithTranslations, 
            [language_code, language_code, order.order_id]
        );
        
        const statusHistory = await queryAsync(queries.getOrderStatusHistory, [order.order_id]);
        
        ordersWithDetails.push({
            ...order,
            order_items: orderItems,
            status_history: statusHistory
        });
    }

    successResponse(res, {
        data: ordersWithDetails,
        message: "Orders retrieved successfully",
        statusCode: 200
    });
});



const getOrderByOrderId = asyncHandler(async (req, res) => {
    const { order_id, language_code = 'en' } = req.body;

    if (!order_id) {
        throwError("Missing order id in request query", 400);
    }
    const numericOrderId = validateAndExtractOrderId(order_id);
    // Get orders for the given order id
    const orders = await queryAsync(queries.getOrderById, [numericOrderId]);

    if (orders.length === 0) {
        throwError("No orders found for the provided Order Id", 404);
    }

    // Get detailed information for each order
    const ordersWithDetails = [];
    for (const order of orders) {
        const orderItems = await queryAsync(
            queries.getOrderItemsWithTranslations, 
            [language_code, language_code, order.order_id]
        );
        
        const statusHistory = await queryAsync(queries.getOrderStatusHistory, [order.order_id]);
        
        ordersWithDetails.push({
            ...order,
            order_reference: `ORD${order.order_id}`,
            order_items: orderItems,
            status_history: statusHistory
        });
    }

    successResponse(res, {
        data: ordersWithDetails,
        message: "Orders retrieved successfully",
        statusCode: 200
    });
});

function validateAndExtractOrderId(orderId) {
    if (!orderId || typeof orderId !== 'string') {
        throwError("Invalid order ID: Must be a string", 400);
    }

    // Case-insensitive check for 'ord' prefix
    if (!/^ord/i.test(orderId)) {
        throwError("Invalid order ID format: Must start with 'ord'", 400);
    }

    // Extract numeric part
    const numericPart = orderId.substring(3);
    const numericId = parseInt(numericPart, 10);

    if (isNaN(numericId) || numericId <= 0) {
        throwError("Invalid order ID: Must contain a positive number after 'ord'", 400);
    }

    return numericId;
}

module.exports = {
    placeOrder,
    getOrderDetails,
    getOrders,
    getOrdersByMobile,
    getOrderByOrderId,
};