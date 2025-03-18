const queries = require("../queries/categoryQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");

// Helper function to get category translations
const getCategoryWithTranslation = async (categoryId, lang) => {
    const category = await queryAsync(queries.getCategoryById, [lang, categoryId]);

    if (category.length === 0) return null;

    return {
        id: category[0].id,
        name: category[0].name,
    };
};

// Get All Categories
const getAllCategories = asyncHandler(async (req, res) => {
    const { lang = "en" } = req.query; // Default language is English

    // Fetch all categories
    const categories = await queryAsync(queries.getAllCategories, [lang]);

    // Fetch units for each category
    for (const category of categories) {
        const units = await queryAsync(queries.getUnitsByCategoryId, [lang, category.id]);
        category.units = units; // Add units to each category
    }

    successResponse(res, { data: categories, message: "Categories retrieved successfully" });
});

// Get a Single Category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { lang = "en" } = req.query; // Default language is English

    const category = await getCategoryWithTranslation(id, lang);
    if (!category) throwError("Category not found", 404);

    // Fetch associated units
    const units = await queryAsync(queries.getUnitsByCategoryId, [lang, id]);

    successResponse(res, { data: { ...category, units }, message: "Category retrieved successfully" });
});

// Create a New Category with Units
const createCategory = asyncHandler(async (req, res) => {
    const { default_name, translations, unit_ids } = req.body;

    // Insert category
    const result = await queryAsync(queries.insertCategory, []);
    const categoryId = result.insertId;

    // Insert translations
    for (const { lang, name } of translations) {
        await queryAsync(queries.insertCategoryTranslation, [categoryId, lang, name]);
    }

    // Assign units to the category
    if (unit_ids && unit_ids.length > 0) {
        for (const unitId of unit_ids) {
            await queryAsync(queries.assignUnitsToCategory, [categoryId, unitId]);
        }
    }

    successResponse(res, {
        data: { id: categoryId, translations },
        message: "Category created successfully",
        statusCode: 201
    });
});

// Update a Category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { translations, unit_ids } = req.body;

    // Verify category exists
    const category = await queryAsync(queries.getCategoryById, ["en", id]);
    if (category.length === 0) throwError("Category not found", 404);

    // Remove old translations and add new ones
    await queryAsync(queries.removeCategoryTranslations, [id]);
    for (const { lang, name } of translations) {
        await queryAsync(queries.insertCategoryTranslation, [id, lang, name]);
    }

    // Remove old unit assignments and assign new ones
    await queryAsync(queries.removeUnitsFromCategory, [id]);
    if (unit_ids && unit_ids.length > 0) {
        for (const unitId of unit_ids) {
            await queryAsync(queries.assignUnitsToCategory, [id, unitId]);
        }
    }

    successResponse(res, { message: "Category updated successfully" });
});

// Delete a Category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Verify category exists
    const category = await queryAsync(queries.getCategoryById, ["en", id]);
    if (category.length === 0) throwError("Category not found", 404);

    // Remove translations
    await queryAsync(queries.removeCategoryTranslations, [id]);

    // Remove category-units mapping
    await queryAsync(queries.removeUnitsFromCategory, [id]);

    // Delete the category
    const result = await queryAsync(queries.deleteCategory, [id]);
    if (result.affectedRows === 0) throwError("Category not found", 404);

    successResponse(res, { message: "Category deleted successfully" });
});

module.exports = { 
    getAllCategories,
    getCategoryById,
    createCategory, 
    updateCategory, 
    deleteCategory 
};