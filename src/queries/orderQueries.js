// Order creation and management queries
const createOrder = `
    INSERT INTO orders (
        user_id, 
        name, 
        mobile_no, 
        email, 
        shipping_address, 
        shipping_method, 
        sub_total, 
        discount, 
        shipping_cost, 
        tax, 
        total, 
        order_status, 
        payment_method, 
        transaction_id, 
        coupon_code, 
        order_notes, 
        order_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
`;

const addOrderItem = `
    INSERT INTO order_items (
        order_id, 
        product_id, 
        product_name, 
        unit_id, 
        quantity, 
        selling_price, 
        mrp, 
        item_sub_total, 
        item_discount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const addOrderStatusHistory = `
    INSERT INTO order_status_history (
        order_id, 
        status, 
        status_description, 
        created_at
    ) VALUES (?, ?, ?, NOW())
`;

const updateProductStock = `
    UPDATE product_units 
    SET in_stock = in_stock - ? 
    WHERE product_id = ? AND unit_id = ?
`;

const restoreProductStock = `
    UPDATE product_units 
    SET in_stock = in_stock + ? 
    WHERE product_id = ? AND unit_id = ?
`;

// Order retrieval queries
const getOrderById = `
    SELECT 
        o.order_id, 
        o.order_date, 
        o.order_status, 
        o.name, 
        o.mobile_no, 
        o.email, 
        o.shipping_address, 
        o.shipping_method, 
        o.sub_total, 
        o.discount, 
        o.shipping_cost, 
        o.tax, 
        o.total, 
        o.payment_method, 
        o.transaction_id, 
        o.coupon_code, 
        o.order_notes 
    FROM orders o 
    WHERE o.order_id = ?
`;

const getOrderItemsByOrderId = `
    SELECT 
        oi.product_id, 
        oi.product_name, 
        oi.unit_id, 
        oi.quantity, 
        oi.selling_price, 
        oi.mrp 
    FROM order_items oi 
    WHERE oi.order_id = ?
`;

const getOrderStatusHistory = `
    SELECT 
        status, 
        status_description, 
        created_at 
    FROM order_status_history
    WHERE order_id = ?
    ORDER BY created_at ASC
`;

const getProductsByOrderId = `
    SELECT 
        oi.product_id,
        COALESCE(pt.name, 'Unnamed') AS product_name,
        pi.image_url AS product_image,
        oi.quantity,
        oi.selling_price AS price,
        oi.item_sub_total AS total_price,
        oi.mrp AS mrp
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.product_id
    LEFT JOIN product_translations pt ON p.product_id = pt.product_id AND pt.language_code = ?
    LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
    WHERE oi.order_id = ?
`;

const updateOrderStatus = `
    UPDATE orders
    SET order_status = ?, order_date = NOW()
    WHERE order_id = ?
`;

module.exports = {
    createOrder,
    addOrderItem,
    addOrderStatusHistory,
    updateProductStock,
    restoreProductStock,
    getOrderById,
    getOrderItemsByOrderId,
    getOrderStatusHistory,
    getProductsByOrderId,
    updateOrderStatus
};
