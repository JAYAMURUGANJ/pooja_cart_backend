const queries = require("../queries/productQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");


// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
    const { lang = "en", category_id, page = 1, limit = 10 } = req.query;

    // Ensure limit and offset are numbers
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = (parseInt(page, 10) - 1) * parsedLimit;

    try {
        let products, totalProducts;
        
        if (category_id) {
            products = await queryAsync(queries.getProductsByCategoryPaginated, [lang, category_id, parsedLimit, parsedOffset]);
            totalProducts = await queryAsync(queries.getProductCountByCategory, [category_id]);
        } else {
            products = await queryAsync(queries.getAllProductsPaginated, [lang, parsedLimit, parsedOffset]);
            totalProducts = await queryAsync(queries.getTotalProductCount);
        }

        for (const product of products) {
            product.units = await queryAsync(queries.getProductUnits, [lang, product.id]);
            product.images = await queryAsync(queries.getPrimaryProductImage, [product.id]);

            const defaultUnit = product.units.find(unit => unit.is_default);
            if (defaultUnit) {
                product.mrp = defaultUnit.mrp;
                product.selling_price = defaultUnit.selling_price;
            } else if (product.units.length > 0) {
                product.mrp = product.units[0].mrp;
                product.selling_price = product.units[0].selling_price;
            } else {
                product.mrp = 0;
                product.selling_price = 0;
            }
        }

        successResponse(res, {
            data: products,
            message: "Products retrieved successfully",
            pagination: {
                total: totalProducts[0]?.count || 0,
                page: Number(page),
                limit: parsedLimit,
                totalPages: Math.ceil((totalProducts[0]?.count || 0) / parsedLimit),
            },
        });
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
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

    product.units = await queryAsync(queries.getProductUnits, [lang, id]);
    product.images = await queryAsync(queries.getProductImages, [id]);

    const defaultUnit = product.units.find(unit => unit.is_default);
    if (defaultUnit) {
        product.mrp = defaultUnit.mrp;
        product.selling_price = defaultUnit.selling_price;
    } else if (product.units.length > 0) {
        product.mrp = product.units[0].mrp;
        product.selling_price = product.units[0].selling_price;
    } else {
        product.mrp = 0;
        product.selling_price = 0;
    }

    successResponse(res, { data: product, message: "Product retrieved successfully" });
});

// Create a New Product
const createProduct = asyncHandler(async (req, res) => {
    const { category_id, is_active = true, translations = [], units = [], images = [] } = req.body;

    if (!category_id) throwError("Category ID is required", 400);
    if (units.length === 0) throwError("At least one unit with pricing information is required", 400);

    for (const unit of units) {
        if (!unit.selling_price || !unit.mrp) throwError("MRP and selling price are required for each unit", 400);
        if (unit.selling_price > unit.mrp) throwError("Selling price cannot be greater than MRP", 400);
    }

    const result = await queryAsync(queries.insertProduct, [category_id, is_active]);
    const productId = result.insertId;

    for (const { lang, name, description = '' } of translations) {
        await queryAsync(queries.insertProductTranslation, [productId, lang, name, description]);
    }

    for (const { unit_id, conversion_factor = 1, mrp, selling_price, price_adjustment = 0, is_default = false, in_stock = 0 } of units) {
        await queryAsync(queries.insertProductUnit, [productId, unit_id, conversion_factor, mrp, selling_price, price_adjustment, is_default, in_stock]);
    }

    for (const { image_url, is_primary = false, display_order = 0 } of images) {
        await queryAsync(queries.insertProductImage, [productId, image_url, is_primary, display_order]);
    }

    successResponse(res, { data: { id: productId }, message: "Product created successfully", statusCode: 201 });
});

// Update a Product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { category_id, is_active, translations = [], units = [], images = [] } = req.body;

    const productCheck = await queryAsync(queries.getProductById, ["en", "en", id]);
    if (productCheck.length === 0) throwError("Product not found", 404);

    for (const unit of units) {
        if (!unit.selling_price || !unit.mrp) throwError("MRP and selling price are required for each unit", 400);
        if (unit.selling_price > unit.mrp) throwError("Selling price cannot be greater than MRP", 400);
    }

    await queryAsync(queries.updateProduct, [category_id, is_active, id]);

    await queryAsync(queries.removeProductTranslations, [id]);
    for (const { lang, name, description = '' } of translations) {
        await queryAsync(queries.insertProductTranslation, [id, lang, name, description]);
    }

    await queryAsync(queries.removeProductUnits, [id]);
    for (const { unit_id, conversion_factor = 1, mrp, selling_price, price_adjustment = 0, is_default = false, in_stock = 0 } of units) {
        await queryAsync(queries.insertProductUnit, [id, unit_id, conversion_factor, mrp, selling_price, price_adjustment, is_default, in_stock]);
    }

    if (images && images.length > 0) {
        const existingImages = await queryAsync(queries.getProductImages, [id]);
        for (const image of images) {
            const existingImage = existingImages.find(img => img.id === image.id);
            if (existingImage) {
                await queryAsync(queries.updateProductImage, [image.image_url, image.is_primary, image.display_order, image.id, id]);
            } else {
                await queryAsync(queries.insertProductImage, [id, image.image_url, image.is_primary, image.display_order]);
            }
        }
    }

    successResponse(res, { message: "Product updated successfully" });
});

// Delete a Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const productCheck = await queryAsync(queries.getProductById, ["en", "en", id]);
    if (productCheck.length === 0) throwError("Product not found", 404);

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
