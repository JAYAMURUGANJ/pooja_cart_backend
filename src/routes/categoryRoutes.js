const express = require("express");
const db = require("../../config/db");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware
const controller = require("../controllers/categoryController");

const router = express.Router();

// ✅ Get All Categories (Public)
router.get("/",authMiddleware, controller.getAllCategories);
router.get("/:id",authMiddleware, controller.getCategoryById);
router.post('/',authMiddleware, controller.createCategory);
router.put('/:id',authMiddleware, controller.updateCategory);
router.delete('/:id',authMiddleware, controller.deleteCategory);

module.exports = router;
