const queries = require("../queries/productQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");

// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
    const { lang = "en", category_id } = req.query;
    
    let products;
    if (category_id) {
        products = await queryAsync(queries.getProductsByCategory, [lang, category_id]);
    } else {
        products = await queryAsync(queries.getAllProducts, [lang, lang]);
    }
    
    // Fetch units and images for each product
    for (const product of products) {
        product.units = await queryAsync(queries.getProductUnits, [lang, product.id]);
        product.images = await queryAsync(queries.getProductImages, [product.id]);
    }
    
    successResponse(res, { data: products, message: "Products retrieved successfully" });
});

// Get a Single Product by ID
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { lang = "en" } = req.query;
    
    const products = await queryAsync(queries.getProductById, [lang, lang, id]);
    
    if (products.length === 0) {
        throwError("Product not found", 404);
    }
    
    const product = products[0];
    
    // Fetch units and images
    product.units = await queryAsync(queries.getProductUnits, [lang, id]);
    product.images = await queryAsync(queries.getProductImages, [id]);
    
    successResponse(res, { data: product, message: "Product retrieved successfully" });
});

// Create a New Product
const createProduct = asyncHandler(async (req, res) => {
    const { 
        category_id, 
        mrp,
        selling_price,
        is_active = true, 
        translations = [], 
        units = [],
        images = []
    } = req.body;
    
    // Basic validation
    if (!category_id || !mrp || !selling_price) {
        throwError("Category ID, MRP, and selling price are required", 400);
    }
    
    if (selling_price > mrp) {
        throwError("Selling price cannot be greater than MRP", 400);
    }
    
    // Insert product
    const result = await queryAsync(queries.insertProduct, [category_id, mrp, selling_price, is_active]);
    const productId = result.insertId;
    
    // Insert translations
    for (const { lang, name, description = '' } of translations) {
        await queryAsync(queries.insertProductTranslation, [productId, lang, name, description]);
    }
    
    // Insert units
    for (const { unit_id, conversion_factor = 1, price_adjustment = 0, is_default = false } of units) {
        await queryAsync(queries.insertProductUnit, [
            productId, unit_id, conversion_factor, price_adjustment, is_default
        ]);
    }
    
    // Insert images
    for (const { image_url, is_primary = false, display_order = 0 } of images) {
        await queryAsync(queries.insertProductImage, [
            productId, image_url, is_primary, display_order
        ]);
    }
    
    successResponse(res, {
        data: { id: productId },
        message: "Product created successfully",
        statusCode: 201
    });
});

// Update a Product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { 
        category_id, 
        mrp,
        selling_price,
        is_active, 
        translations = [], 
        units = [],
        images = []
    } = req.body;
    
    // Basic validation
    if (selling_price > mrp) {
        throwError("Selling price cannot be greater than MRP", 400);
    }
    
    // Verify product exists
    const productCheck = await queryAsync(queries.getProductById, ["en", "en", id]);
    if (productCheck.length === 0) {
        throwError("Product not found", 404);
    }
    
    // Update product
    await queryAsync(queries.updateProduct, [category_id, mrp, selling_price, is_active, id]);
    
    // Update translations
    await queryAsync(queries.removeProductTranslations, [id]);
    for (const { lang, name, description = '' } of translations) {
        await queryAsync(queries.insertProductTranslation, [id, lang, name, description]);
    }
    
    // Update units
    await queryAsync(queries.removeProductUnits, [id]);
    for (const { unit_id, conversion_factor = 1, price_adjustment = 0, is_default = false } of units) {
        await queryAsync(queries.insertProductUnit, [
            id, unit_id, conversion_factor, price_adjustment, is_default
        ]);
    }
    
    // Update images - handling this separately since we may want to keep existing images
    if (images && images.length > 0) {
        // Here we're assuming we want to replace all images
        // In a real app, you might want more granular control
        const existingImages = await queryAsync(queries.getProductImages, [id]);
        for (const image of existingImages) {
            await queryAsync(queries.deleteProductImage, [image.id, id]);
        }
        
        for (const { image_url, is_primary = false, display_order = 0 } of images) {
            await queryAsync(queries.insertProductImage, [
                id, image_url, is_primary, display_order
            ]);
        }
    }
    
    successResponse(res, { message: "Product updated successfully" });
});

// Delete a Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Verify product exists
    const productCheck = await queryAsync(queries.getProductById, ["en", "en", id]);
    if (productCheck.length === 0) {
        throwError("Product not found", 404);
    }
    
    // Related records (translations, units, images) will be automatically deleted due to ON DELETE CASCADE
    await queryAsync(queries.deleteProduct, [id]);
    
    successResponse(res, { message: "Product deleted successfully" });
});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};