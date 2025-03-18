const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware
const controller = require("../controllers/productController");
require("dotenv").config();

const router = express.Router();

// Product routes
router.get('/', controller.getAllProducts);
router.get('/:id',controller.getProductById);
router.post('/', controller.createProduct);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);


module.exports = router;
