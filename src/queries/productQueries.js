const getAllProducts = `
    SELECT p.id, p.mrp, p.selling_price, p.is_active, p.category_id, 
           COALESCE(pt.name, 'Unnamed') AS name,
           COALESCE(pt.description, '') AS description,
           COALESCE(ct.name, 'Unnamed') AS category_name
    FROM products p
    LEFT JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = ?
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.language_code = ?
`;

const getProductById = `
    SELECT p.id, p.mrp, p.selling_price, p.is_active, p.category_id, 
           COALESCE(pt.name, 'Unnamed') AS name,
           COALESCE(pt.description, '') AS description,
           COALESCE(ct.name, 'Unnamed') AS category_name
    FROM products p
    LEFT JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = ?
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.language_code = ?
    WHERE p.id = ?
`;

const getProductsByCategory = `
    SELECT p.id, p.mrp, p.selling_price, p.is_active, p.category_id, 
           COALESCE(pt.name, 'Unnamed') AS name,
           COALESCE(pt.description, '') AS description
    FROM products p
    LEFT JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = ?
    WHERE p.category_id = ?
`;

const insertProduct = `
    INSERT INTO products (category_id, mrp, selling_price, is_active)
    VALUES (?, ?, ?, ?)
`;

const updateProduct = `
    UPDATE products
    SET category_id = ?, mrp = ?, selling_price = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
`;

const deleteProduct = `
    DELETE FROM products
    WHERE id = ?
`;

const insertProductTranslation = `
    INSERT INTO product_translations (product_id, language_code, name, description)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)
`;

const removeProductTranslations = `
    DELETE FROM product_translations
    WHERE product_id = ?
`;

const getProductUnits = `
    SELECT pu.unit_id, pu.conversion_factor, pu.price_adjustment, pu.is_default,
           COALESCE(ut.name, 'Unnamed') AS name,
           COALESCE(ut.abbreviation, '') AS abbreviation
    FROM product_units pu
    JOIN unit_master u ON pu.unit_id = u.id
    LEFT JOIN unit_translations ut ON u.id = ut.unit_id AND ut.language_code = ?
    WHERE pu.product_id = ?
`;

const insertProductUnit = `
    INSERT INTO product_units (product_id, unit_id, conversion_factor, price_adjustment, is_default)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    conversion_factor = VALUES(conversion_factor),
    price_adjustment = VALUES(price_adjustment),
    is_default = VALUES(is_default)
`;

const removeProductUnits = `
    DELETE FROM product_units
    WHERE product_id = ?
`;

const removeProductUnit = `
    DELETE FROM product_units
    WHERE product_id = ? AND unit_id = ?
`;

const getProductImages = `
    SELECT id, image_url, is_primary, display_order
    FROM product_images
    WHERE product_id = ?
    ORDER BY display_order ASC
`;

const insertProductImage = `
    INSERT INTO product_images (product_id, image_url, is_primary, display_order)
    VALUES (?, ?, ?, ?)
`;

const updateProductImage = `
    UPDATE product_images
    SET image_url = ?, is_primary = ?, display_order = ?
    WHERE id = ? AND product_id = ?
`;

const deleteProductImage = `
    DELETE FROM product_images
    WHERE id = ? AND product_id = ?
`;

module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    insertProduct,
    updateProduct,
    deleteProduct,
    insertProductTranslation,
    removeProductTranslations,
    getProductUnits,
    insertProductUnit,
    removeProductUnits,
    removeProductUnit,
    getProductImages,
    insertProductImage,
    updateProductImage,
    deleteProductImage
};