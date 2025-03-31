const queries = require("../queries/orderQueries");
const productQueries = require("../queries/productQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");

// Create a new order
const placeOrder = asyncHandler(async (req, res) => {
    const {
        shipping_details,
        order_items,
        payment_details,
        coupon_code = null,
        order_notes = ''
    } = req.body;

    if (!shipping_details || !order_items || order_items.length === 0 || !payment_details) {
        throwError("Invalid order data", 400);
    }

    // Start transaction
    await queryAsync('START TRANSACTION');

    try {
        let sub_total = 0;
        let total_mrp = 0;
        let total_discount = 0;

        for (const item of order_items) {
            const { product_id, unit_id, quantity, selling_price, mrp } = item;
            if (!product_id || !unit_id || !quantity || !selling_price || !mrp) {
                await queryAsync('ROLLBACK');
                throwError("Missing order item details", 400);
            }

            const product = await queryAsync(productQueries.getProductById, ["en", "en", product_id]);
            if (!product.length || !product[0].is_active) {
                await queryAsync('ROLLBACK');
                throwError(`Product ID ${product_id} not found or inactive`, 400);
            }

            const units = await queryAsync(productQueries.getProductUnits, ["en", product_id]);
            const unit = units.find(u => u.unit_id === unit_id);
            if (!unit || unit.in_stock < quantity) {
                await queryAsync('ROLLBACK');
                throwError(`Insufficient stock for Product ID ${product_id}`, 400);
            }

            sub_total += selling_price * quantity;
            total_mrp += mrp * quantity;
            total_discount += (mrp - selling_price) * quantity;
        }

        const shipping_cost = 7.99;
        const tax = sub_total * 0.0925;
        const total = sub_total + shipping_cost + tax;

        const orderResult = await queryAsync(queries.createOrder, [
            shipping_details.name,
            shipping_details.mobile_no,
            shipping_details.shipping_address,
            shipping_details.shipping_method,
            sub_total,
            total_discount,
            shipping_cost,
            tax,
            total,
            'pending',
            payment_details.payment_method,
            payment_details.transaction_id,
            coupon_code,
            order_notes
        ]);

        const orderId = orderResult.insertId;

        for (const item of order_items) {
            await queryAsync(queries.addOrderItem, [
                orderId,
                item.product_id,
                item.unit_id,
                item.quantity,
                item.selling_price,
                item.mrp
            ]);
            await queryAsync(queries.updateProductStock, [item.quantity, item.product_id, item.unit_id]);
        }

        await queryAsync(queries.addOrderStatusHistory, [orderId, 'pending', 'Order placed']);

        await queryAsync('COMMIT');

        successResponse(res, {
            data: {
                order_id: `ORD-${orderId}`,
                order_date: new Date().toISOString(),
                order_status: "pending",
                shipping_details: {
                    ...shipping_details,
                    email: "john.doe@example.com" // Placeholder email
                },
                order_items,
                sub_total,
                discount: total_discount,
                shipping_cost,
                tax,
                total,
                payment_details,
                coupon_code,
                order_notes
            },
            message: "Order placed successfully",
            statusCode: 201
        });
    } catch (error) {
        await queryAsync('ROLLBACK');
        console.error("Order placement error:", error);
        throwError(error.message || "Failed to place order", error.statusCode || 500);
    }
});


// Get all orders for a user
const getUserOrders = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const { page = 1, limit = 10, status, lang = "en" } = req.query;
    
    // Ensure limit and offset are numbers
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = (parseInt(page, 10) - 1) * parsedLimit;
    
    try {
        let orders, totalOrders;
        
        if (status) {
            orders = await queryAsync(queries.getUserOrdersByStatusPaginated, [user_id, status, parsedLimit, parsedOffset]);
            totalOrders = await queryAsync(queries.getUserOrdersCountByStatus, [user_id, status]);
        } else {
            orders = await queryAsync(queries.getUserOrdersPaginated, [user_id, parsedLimit, parsedOffset]);
            totalOrders = await queryAsync(queries.getUserOrdersCount, [user_id]);
        }

        // Fetch product details for each order
        for (const order of orders) {
            const products = await queryAsync(queries.getProductsByOrderId, [lang, order.id]);
            order.products = products; // Add products array to each order
        }
        
        successResponse(res, {
            data: orders,
            message: "Orders retrieved successfully",
            pagination: {
                total: totalOrders[0]?.count || 0,
                page: Number(page),
                limit: parsedLimit,
                totalPages: Math.ceil((totalOrders[0]?.count || 0) / parsedLimit),
            },
        });
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


// Get order details by ID
const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get order_id from params
    const { lang = "en" } = req.query;

    // Fetch order details
    const orders = await queryAsync(queries.getOrderById, [id]);

    if (orders.length === 0) {
        throwError("Order not found", 404);
    }

    const order = orders[0];

    // Fetch order items
    order.items = await queryAsync(queries.getOrderItemsByOrderId, [id]);

    // Fetch order status history
    order.status_history = await queryAsync(queries.getOrderStatusHistory, [id]);

    successResponse(res, { data: order, message: "Order retrieved successfully" });
});


// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, comment = '' } = req.body;
    
    if (!status) throwError("Status is required", 400);
    
    // Valid statuses - these should match your application's status flow
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];
    
    if (!validStatuses.includes(status)) {
        throwError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }
    
    const orderCheck = await queryAsync(queries.getOrderById, [id]);
    if (orderCheck.length === 0) throwError("Order not found", 404);
    
    const order = orderCheck[0];
    
    // Implement status transition validations if needed
    // For example, you might not want to allow a DELIVERED order to go back to PENDING
    
    // Handling special case for CANCELLED status
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
        // Restore inventory for cancelled orders
        const orderItems = await queryAsync(queries.getOrderItemsBasic, [id]);
        
        // Start transaction
        await queryAsync('START TRANSACTION');
        
        try {
            for (const item of orderItems) {
                // Restore stock for each item
                await queryAsync(queries.restoreProductStock, [
                    item.quantity, 
                    item.product_id, 
                    item.unit_id
                ]);
            }
            
            // Update order status
            await queryAsync(queries.updateOrderStatus, [status, id]);
            
            // Add status history entry
            await queryAsync(queries.addOrderStatusHistory, [id, status, comment]);
            
            // Commit transaction
            await queryAsync('COMMIT');
            
        } catch (error) {
            // Rollback in case of error
            await queryAsync('ROLLBACK');
            throw error;
        }
    } else {
        // For normal status updates
        await queryAsync(queries.updateOrderStatus, [status, id]);
        await queryAsync(queries.addOrderStatusHistory, [id, status, comment]);
    }
    
    successResponse(res, { message: "Order status updated successfully" });
});

module.exports = {
    placeOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};