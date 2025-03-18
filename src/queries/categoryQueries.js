const getAllCategories = `
    SELECT c.id, COALESCE(ct.name, 'Unnamed') AS name
    FROM categories c
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.language_code = ?
`;

const getCategoryById = `
    SELECT c.id, COALESCE(ct.name, 'Unnamed') AS name
    FROM categories c
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.language_code = ?
    WHERE c.id = ?
`;

const insertCategory = `
    INSERT INTO categories () VALUES ()
`;

const insertCategoryTranslation = `
    INSERT INTO category_translations (category_id, language_code, name) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE name = VALUES(name)
`;

const removeCategoryTranslations = `
    DELETE FROM category_translations WHERE category_id = ?
`;

const getUnitsByCategoryId = `
    SELECT u.id, COALESCE(ut.name, 'Unnamed') AS name, COALESCE(ut.abbreviation, '') AS abbreviation 
    FROM unit_master u 
    JOIN category_units cu ON u.id = cu.unit_id 
    LEFT JOIN unit_translations ut ON u.id = ut.unit_id AND ut.language_code = ?
    WHERE cu.category_id = ?
`;

const assignUnitsToCategory = `
    INSERT INTO category_units (category_id, unit_id) VALUES (?, ?)
`;

const removeUnitsFromCategory = `
    DELETE FROM category_units WHERE category_id = ?
`;

const deleteCategory = `
    DELETE FROM categories WHERE id = ?
`;

module.exports = {
    getAllCategories,
    getCategoryById,
    insertCategory,
    insertCategoryTranslation,
    removeCategoryTranslations,
    getUnitsByCategoryId,
    assignUnitsToCategory,
    removeUnitsFromCategory,
    deleteCategory
};