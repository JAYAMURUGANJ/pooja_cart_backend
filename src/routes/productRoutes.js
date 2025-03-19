const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware
const controller = require("../controllers/productController");
require("dotenv").config();

const router = express.Router();

// Product routes
router.get('/',authMiddleware, controller.getAllProducts);
router.get('/:id',authMiddleware,  controller.getProductById);
router.post('/',authMiddleware, controller.createProduct);
router.put('/:id',authMiddleware, controller.updateProduct);
router.delete('/:id',authMiddleware, controller.deleteProduct);


module.exports = router;
