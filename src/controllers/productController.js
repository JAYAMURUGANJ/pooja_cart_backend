const queries = require("../queries/productQueries");
const { successResponse } = require("../utils/responseHelper");
const asyncHandler = require("../utils/asyncHandler");
const queryAsync = require("../utils/dbQuery");
const { throwError } = require("../utils/errorHandler");
const fs = require('fs').promises; 
const path = require('path'); 


// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
    const { lang = "en", category_id, page = 1, limit = 10 } = req.query;

    // Ensure limit and offset are numbers
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = (parseInt(page, 10) - 1) * parsedLimit;

    try {
        let products, totalProducts;
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        if (category_id) {
            products = await queryAsync(queries.getProductsByCategoryPaginated, [lang, category_id, parsedLimit, parsedOffset]);
            totalProducts = await queryAsync(queries.getProductCountByCategory, [category_id]);
        } else {
            products = await queryAsync(queries.getAllProductsPaginated, [lang, parsedLimit, parsedOffset]);
            totalProducts = await queryAsync(queries.getTotalProductCount);
        }

        for (const product of products) {
            product.units = await queryAsync(queries.getProductUnits, [lang, product.id]);
            product.images = (await queryAsync(queries.getPrimaryProductImage, [product.id])).map(img => ({
                ...img,
                image_url: `${baseUrl}${img.image_url}`
            }));
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

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const products = await queryAsync(queries.getProductById, [lang, lang, id]);
    

    if (products.length === 0) {
        throwError("Product not found", 404);
    }

    const product = products[0];

    product.units = await queryAsync(queries.getProductUnits, [lang, id]);
    product.images = (await queryAsync(queries.getProductImages, [id])).map(img => ({
        ...img,
        image_url: `${baseUrl}${img.image_url}`
    }));


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
    console.log("request body:", req.body);
    const { category_id, is_active = true } = req.body;
    const translations = JSON.parse(req.body.translations || '[]');

    const units = JSON.parse(req.body.units || '[]');
    let images = [];
    const uploadedFiles = req.compressedFiles || [];
    uploadedFiles.forEach((file, index) => {
        images.push({
            image_url: `/uploads/${file.filename}`,
            is_primary: index === 0,
            display_order: index
        });
    });

    if (!category_id) throwError("Category ID is required", 400);
    if (translations.length === 0) throwError("At least one name is required", 400);
    if (units.length === 0) throwError("At least one unit with pricing information is required", 400);

    for (const translation of translations) {
        if (!translation.lang || !translation.name) throwError("Name and language is required for each product", 400);
    }
    for (const unit of units) {
        if (!unit.selling_price || !unit.mrp) throwError("MRP and selling price are required for each unit", 400);
        if (unit.selling_price > unit.mrp) throwError("Selling price cannot be greater than MRP", 400);
    }

    const result = await queryAsync(queries.insertProduct, [category_id, is_active]);
    const productId = result.insertId;

    for (const { lang, name, description = '' } of translations) {
        await queryAsync(queries.insertProductTranslation, [productId, lang, name, description]);
    }

    for (const { unit_id, conversion_factor = 1, mrp, selling_price,  is_default = false, in_stock = 0 } of units) {
        await queryAsync(queries.insertProductUnit, [productId, unit_id, conversion_factor, mrp, selling_price, is_default, in_stock]);
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

// Delete a Product and its associated images
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the product exists
    const productCheck = await queryAsync(queries.getProductById, ["en", "en", id]);
    if (productCheck.length === 0) throwError("Product not found", 404);

    // Retrieve associated images for the product
    const productImages = await queryAsync(queries.getProductImages, [id]);

    // Log the productImages to check the structure
    console.log('Product Images:', productImages);

    // If there are images, attempt to delete them from the file system
    for (const image of productImages) {
        // Ensure image_url exists and is valid
        if (image.image_url) {
            // Extract the filename from the image_url
            const filename = image.image_url.split('/').pop();  // Get the filename from URL

            // Construct the absolute path to the image file (assuming images are stored in 'uploads' directory at the root)
            const imagePath = path.join(__dirname, '..', '..', 'uploads', filename);  // Go up two levels from 'src/controllers'

            // Log the image path to verify
            console.log(`Attempting to delete image at: ${imagePath}`);

            try {
                await fs.unlink(imagePath);  // Delete the image file
                console.log(`Successfully deleted image: ${imagePath}`);
            } catch (err) {
                console.error(`Failed to delete image: ${imagePath}`, err);
            }
        } else {
            console.warn('Image URL is undefined or missing for product:', productImages);
        }
    }

    // Now delete the product from the database
    await queryAsync(queries.deleteProduct, [id]);

    successResponse(res, { message: "Product and associated images deleted successfully" });
});


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
