const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware
const controller = require("../controllers/productController");
const { upload, compressImages } = require('../middleware/upload');
require("dotenv").config();

const router = express.Router();

// Product routes
router.get('/', controller.getAllProducts);
router.get('/:id',  controller.getProductById);
router.post('/', upload.array('images', 5), compressImages, controller.createProduct);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);


module.exports = router;
