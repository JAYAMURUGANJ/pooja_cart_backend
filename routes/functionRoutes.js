const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware

const router = express.Router();

// ✅ Get All Functions (Public)
router.get("/", (req, res) => {
    const sql = "SELECT * FROM functions";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ Add a New Function (Protected)
router.post("/", authMiddleware, (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Function name is required" });
    }

    const sql = "INSERT INTO functions (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Function added successfully", id: result.insertId });
    });
});

// ✅ Update a Function (Protected)
router.put("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Function name is required" });
    }

    const sql = "UPDATE functions SET name = ? WHERE id = ?";
    db.query(sql, [name, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Function not found" });
        }
        res.json({ message: "Function updated successfully" });
    });
});

// ✅ Delete a Function (Protected)
router.delete("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM functions WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Function not found" });
        }
        res.json({ message: "Function deleted successfully" });
    });
});

module.exports = router;
