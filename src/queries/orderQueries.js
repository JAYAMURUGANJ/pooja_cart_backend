// Order creation and management queries
const createOrder = `
    INSERT INTO orders (
        user_id, 
        address_id, 
        subtotal, 
        total_mrp, 
        total_discount, 
        delivery_fee, 
        taxes, 
        grand_total, 
        status, 
        payment_method, 
        special_instructions
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const addOrderItem = `
    INSERT INTO order_items (
        order_id, 
        product_id, 
        unit_id, 
        quantity, 
        unit_price, 
        unit_mrp, 
        total_price, 
        total_mrp, 
        discount
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const addOrderStatusHistory = `
    INSERT INTO order_status_history (
        order_id, 
        status, 
        comment
    )
    VALUES (?, ?, ?)
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
const getUserOrdersPaginated = `
    SELECT 
        o.id, 
        o.user_id, 
        o.address_id, 
        o.subtotal, 
        o.total_mrp, 
        o.total_discount, 
        o.delivery_fee, 
        o.taxes, 
        o.grand_total, 
        o.status, 
        o.payment_method,
        o.payment_status,
        o.created_at, 
        o.updated_at,
        COUNT(oi.id) AS item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
`;

const getUserOrdersByStatusPaginated = `
    SELECT 
        o.id, 
        o.user_id, 
        o.address_id, 
        o.subtotal, 
        o.total_mrp, 
        o.total_discount, 
        o.delivery_fee, 
        o.taxes, 
        o.grand_total, 
        o.status, 
        o.payment_method,
        o.payment_status,
        o.created_at, 
        o.updated_at,
        COUNT(oi.id) AS item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ? AND o.status = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
`;

const getUserOrdersCount = `
    SELECT COUNT(*) AS count FROM orders WHERE user_id = ?
`;

const getProductsByOrderId = `
   SELECT 
    oi.product_id,
    COALESCE(pt.name, 'Unnamed') AS product_name,
    pi.image_url AS product_image,
    oi.quantity,
    oi.unit_price AS price,  -- Changed from 'oi.price' to 'oi.unit_price'
    oi.total_price AS total_price,  -- Total price for the quantity ordered
    oi.unit_mrp AS mrp  -- The MRP of a single unit
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id
LEFT JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = ?
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
WHERE oi.order_id = ?
`;

const getUserOrdersCountByStatus = `
    SELECT COUNT(*) AS count FROM orders WHERE user_id = ? AND status = ?
`;

const getOrderById = `
    SELECT 
        o.id, 
        o.user_id, 
        o.address_id, 
        o.subtotal, 
        o.total_mrp, 
        o.total_discount, 
        o.delivery_fee, 
        o.taxes, 
        o.grand_total, 
        o.status, 
        o.payment_method,
        o.payment_status,
        o.special_instructions,
        o.created_at, 
        o.updated_at
    FROM orders o
    WHERE o.id = ?
`;

const getOrderItemsByOrderId = `
    SELECT 
        o.id, 
        o.user_id, 
        o.address_id, 
        o.subtotal, 
        o.total_mrp, 
        o.total_discount, 
        o.delivery_fee, 
        o.taxes, 
        o.grand_total, 
        o.status, 
        o.payment_method,
        o.payment_status,
        o.created_at, 
        o.updated_at,
        COUNT(oi.id) AS item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.order_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
`;





const getOrderStatusHistory = `
    SELECT 
        status, 
        comment, 
        created_at 
    FROM order_status_history
    WHERE order_id = ?
    ORDER BY created_at ASC
`;


const getOrderItems = `
    SELECT 
        oi.id,
        oi.product_id,
        oi.unit_id,
        oi.quantity,
        oi.unit_price,
        oi.unit_mrp,
        oi.total_price,
        oi.total_mrp,
        oi.discount,
        COALESCE(pt.name, 'Unnamed') AS product_name,
        COALESCE(ut.name, 'Unnamed') AS unit_name,
        COALESCE(ut.abbreviation, '') AS unit_abbreviation
    FROM order_items oi
    LEFT JOIN product_translations pt ON oi.product_id = pt.product_id AND pt.language_code = ?
    LEFT JOIN unit_translations ut ON oi.unit_id = ut.unit_id AND ut.language_code = ?
    WHERE oi.order_id = ?
`;

const getOrderItemsBasic = `
    SELECT 
        id,
        product_id,
        unit_id,
        quantity
    FROM order_items
    WHERE order_id = ?
`;



const updateOrderStatus = `
    UPDATE orders
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
`;

module.exports = {
    createOrder,
    addOrderItem,
    getProductsByOrderId,
    addOrderStatusHistory,
    updateProductStock,
    restoreProductStock,
    getUserOrdersPaginated,
    getUserOrdersByStatusPaginated,
    getUserOrdersCount,
    getUserOrdersCountByStatus,
    getOrderById,
    getOrderItemsByOrderId,
    getOrderItems,
    getOrderItemsBasic,
    getOrderStatusHistory,
    updateOrderStatus
};