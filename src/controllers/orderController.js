const queries = require("../queries/orderQueries");
const productQueries = require("../queries/productQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
    const { 
        user_id, 
        address_id, 
        payment_method = 'COD',
        items = [], 
        special_instructions = '' 
    } = req.body;

    // Validation
    if (!user_id) throwError("User ID is required", 400);
    if (!address_id) throwError("Address ID is required", 400);
    if (items.length === 0) throwError("Order must contain at least one item", 400);

    // Start transaction
    const connection = await queryAsync('START TRANSACTION');
    
    try {
        // Calculate order totals
        let subtotal = 0;
        let total_mrp = 0;
        let total_discount = 0;
        
        // First check if all products and their units exist and are in stock
        for (const item of items) {
            const { product_id, unit_id, quantity } = item;
            
            if (!product_id || !unit_id || !quantity) {
                await queryAsync('ROLLBACK');
                throwError("Product ID, unit ID, and quantity are required for each item", 400);
            }
            
            // Check if product exists and is active
            const product = await queryAsync(productQueries.getProductById, ["en", "en", product_id]);
            if (product.length === 0 || !product[0].is_active) {
                await queryAsync('ROLLBACK');
                throwError(`Product with ID ${product_id} not found or is inactive`, 400);
            }
            
            // Check if unit exists for this product and has sufficient stock
            const units = await queryAsync(productQueries.getProductUnits, ["en", product_id]);
            const unit = units.find(u => u.unit_id === unit_id);
            
            if (!unit) {
                await queryAsync('ROLLBACK');
                throwError(`Unit with ID ${unit_id} not found for product ${product_id}`, 400);
            }
            
            if (unit.in_stock < quantity) {
                await queryAsync('ROLLBACK');
                throwError(`Insufficient stock for product ${product_id}. Available: ${unit.in_stock}, Requested: ${quantity}`, 400);
            }
            
            // Calculate item total
            const itemMrp = unit.mrp * quantity;
            const itemPrice = unit.selling_price * quantity;
            
            total_mrp += itemMrp;
            subtotal += itemPrice;
            total_discount += (itemMrp - itemPrice);
        }
        
        // Apply any delivery fees, taxes, etc.
        // For now, keeping it simple
        const delivery_fee = 0; // Could be calculated based on address, order value, etc.
        const taxes = 0; // Could be calculated based on applicable tax rates
        const grand_total = subtotal + delivery_fee + taxes;
        
        // Create order
        const orderResult = await queryAsync(queries.createOrder, [
            user_id, 
            address_id,
            subtotal,
            total_mrp,
            total_discount,
            delivery_fee,
            taxes,
            grand_total,
            'PENDING', // Default status
            payment_method,
            special_instructions
        ]);
        
        const orderId = orderResult.insertId;
        
        // Add order items
        for (const item of items) {
            const { product_id, unit_id, quantity } = item;
            
            // Get current pricing for the product unit
            const units = await queryAsync(productQueries.getProductUnits, ["en", product_id]);
            const unit = units.find(u => u.unit_id === unit_id);
            
            const unitPrice = unit.selling_price;
            const unitMrp = unit.mrp;
            const totalPrice = unitPrice * quantity;
            const totalMrp = unitMrp * quantity;
            const itemDiscount = totalMrp - totalPrice;
            
            // Add order item
            await queryAsync(queries.addOrderItem, [
                orderId,
                product_id,
                unit_id,
                quantity,
                unitPrice,
                unitMrp,
                totalPrice,
                totalMrp,
                itemDiscount
            ]);
            
            // Update inventory (reduce stock)
            await queryAsync(queries.updateProductStock, [quantity, product_id, unit_id]);
        }
        
        // Add order status history
        await queryAsync(queries.addOrderStatusHistory, [orderId, 'PENDING', 'Order placed']);
        
        // Commit transaction
        await queryAsync('COMMIT');
        
        successResponse(res, { 
            data: { 
                order_id: orderId,
                order_total: grand_total,
                status: 'PENDING'
            }, 
            message: "Order placed successfully", 
            statusCode: 201 
        });
        
    } catch (error) {
        // Rollback transaction in case of error
        await queryAsync('ROLLBACK');
        console.error("Order creation error:", error);
        if (!error.statusCode) {
            error.statusCode = 500;
            error.message = "Failed to create order. " + error.message;
        }
        throw error;
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
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};