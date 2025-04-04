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
        order_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const addOrderItem = `
    INSERT INTO order_items (
        order_id, 
        product_id, 
        unit_id, 
        quantity, 
        selling_price, 
        mrp, 
        item_sub_total, 
        item_discount,
        conversion_factor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
`;

const addOrderedProductTranslation = `
    INSERT INTO ordered_product_translations (
        order_item_id,
        language_code,
        name,
        description
    ) VALUES (?, ?, ?, ?)
`;

const addOrderStatusHistory = `
    INSERT INTO order_status_history (
        order_id, 
        status, 
        status_description
    ) VALUES (?, ?, ?)
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
        o.id as order_id, 
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
    WHERE o.id = ?
`;

const getOrderItemsWithTranslations = `
    SELECT 
        oi.id as order_item_id,
        oi.product_id,
        oi.unit_id,
        oi.quantity,
        oi.selling_price,
        oi.mrp,
        oi.item_sub_total,
        oi.item_discount,
        oi.conversion_factor,
        opt.name as product_name,
        opt.description as product_description,
        ut.name as unit_name,
        ut.abbreviation as unit_abbreviation,
        pi.image_url as product_image
    FROM order_items oi 
    JOIN ordered_product_translations opt ON oi.id = opt.order_item_id AND opt.language_code = ?
    LEFT JOIN unit_master um ON oi.unit_id = um.id
    LEFT JOIN unit_translations ut ON um.id = ut.unit_id AND ut.language_code = ?
    LEFT JOIN product_images pi ON oi.product_id = pi.product_id AND pi.is_primary = 1
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

const getOrdersWithPagination = `
    SELECT 
        o.id as order_id, 
        o.order_date, 
        o.order_status, 
        o.name, 
        o.mobile_no, 
        o.shipping_method, 
        o.sub_total, 
        o.total,
        o.payment_method
    FROM orders o
    ORDER BY o.order_date DESC
    LIMIT ? OFFSET ?
`;

const updateOrderStatus = `
    UPDATE orders
    SET order_status = ?
    WHERE id = ?
`;

const getOrdersByMobile= `
 SELECT 
        o.id as order_id, 
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
    WHERE o.mobile_no = ?
`;

// Product related queries
const getProductById = `
    SELECT 
        p.id,
        p.category_id,
        p.is_active,
        pt.name,
        pt.description,
        ct.name as category_name,
        pi.image_url as primary_image
    FROM products p
    JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = ?
    JOIN categories c ON p.category_id = c.id
    JOIN category_translations ct ON c.id = ct.category_id AND ct.language_code = ?
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
    WHERE p.id = ?
`;

const getProductUnits = `
    SELECT 
        pu.unit_id,
        ut.name as unit_name,
        pu.mrp,
        pu.selling_price,
        pu.in_stock,
        pu.is_default,
        pu.conversion_factor
    FROM product_units pu
    JOIN unit_master um ON pu.unit_id = um.id
    JOIN unit_translations ut ON um.id = ut.unit_id AND ut.language_code = ?  
    WHERE pu.product_id = ?
`;

const getProductTranslation = `
    SELECT 
        pt.name,
        pt.description
    FROM product_translations pt
    WHERE pt.language_code = ? AND pt.product_id = ?
`;


module.exports = {
    createOrder,
    addOrderItem,
    addOrderedProductTranslation,
    addOrderStatusHistory,
    updateProductStock,
    restoreProductStock,
    getOrderById,
    getOrderItemsWithTranslations,
    getOrderStatusHistory,
    getOrdersWithPagination,
    updateOrderStatus,
    getOrdersByMobile,
    getProductTranslation,
    getProductById,
    getProductUnits
};