const express = require("express");
const db = require("../../config/db");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware
const controller = require("../controllers/categoryController");

const router = express.Router();

// ✅ Get All Categories (Public)
router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);
router.post('/', controller.createCategory);
router.put('/update', controller.updateCategory);
router.delete('/delete', controller.deleteCategory);

module.exports = router;
