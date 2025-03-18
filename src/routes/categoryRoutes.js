const express = require("express");
const db = require("../../config/db");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware
const controller = require("../controllers/categoryController");

const router = express.Router();

// ✅ Get All Categories (Public)
router.get("/",authMiddleware, controller.getAllCategories);
router.get("/:id",authMiddleware, controller.getCategoryById);

// ✅ Add a New Category (Protected)
router.post("/", authMiddleware, (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }

    const sql = "INSERT INTO categories (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Category added successfully", id: result.insertId });
    });
});

// ✅ Update a Category (Protected)
router.put("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }

    const sql = "UPDATE categories SET name = ? WHERE id = ?";
    db.query(sql, [name, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category updated successfully" });
    });
});

// ✅ Delete a Category (Protected)
router.delete("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM categories WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    });
});

module.exports = router;
