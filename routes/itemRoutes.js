const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get All Items with Category & Function Objects (Public)
router.get("/", (req, res) => {
    const sql = `
        SELECT 
            items.id, items.name, items.unit, items.price, 
            categories.name AS category, 
            GROUP_CONCAT(DISTINCT functions.id) AS function_ids,
            GROUP_CONCAT(DISTINCT functions.name) AS function_names
        FROM items
        LEFT JOIN categories ON items.category_id = categories.id
        LEFT JOIN item_functions ON items.id = item_functions.item_id
        LEFT JOIN functions ON item_functions.function_id = functions.id
        GROUP BY items.id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const items = results.map(row => ({
            id: row.id,
            name: row.name,
            unit: row.unit,
            price: row.price,
            category: row.category,
            function: row.function_ids
                ? row.function_ids.split(',').map((id, index) => ({
                    id: parseInt(id),
                    name: row.function_names.split(',')[index]
                }))
                : []
        }));

        res.json(items);
    });
});

// ✅ Get Items by Category ID (Public) - Moved Above /items/:id to Avoid Conflict
router.get("/category/:category_id", (req, res) => {
    const { category_id } = req.params;
    const sql = `SELECT id, name, unit, price FROM items WHERE category_id = ?`;

    db.query(sql, [category_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ Get Items by Function ID (Public)
router.get("/function/:function_id", (req, res) => {
    const { function_id } = req.params;
    const sql = `
        SELECT DISTINCT items.id, items.name, items.unit, items.price
        FROM items
        JOIN item_functions ON items.id = item_functions.item_id
        WHERE item_functions.function_id = ?
    `;

    db.query(sql, [function_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ Get Item by ID (Public)
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            items.id, items.name, items.unit, items.price, 
            categories.name AS category, 
            functions.id AS function_id, 
            functions.name AS function_name
        FROM items
        LEFT JOIN categories ON items.category_id = categories.id
        LEFT JOIN item_functions ON items.id = item_functions.item_id
        LEFT JOIN functions ON item_functions.function_id = functions.id
        WHERE items.id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Item not found" });

        const item = {
            id: results[0].id,
            name: results[0].name,
            unit: results[0].unit,
            price: results[0].price,
            category: results[0].category,
            function: []
        };

        results.forEach(row => {
            if (row.function_id) {
                item.function.push({
                    id: row.function_id,
                    name: row.function_name
                });
            }
        });

        res.json(item);
    });
});

// 🚀 PROTECTED ROUTES (Require Authentication)

// ✅ Add a New Item (Protected)
router.post("/", authMiddleware, (req, res) => {
    const { name, category_id, function_ids, unit, price } = req.body;

    if (!name || !category_id || !function_ids || !Array.isArray(function_ids) || function_ids.length === 0 || !unit || !price) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const checkFunctionsSQL = "SELECT id FROM functions WHERE id IN (?)";
    db.query(checkFunctionsSQL, [function_ids], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const existingFunctionIds = results.map(row => row.id);
        const missingFunctions = function_ids.filter(id => !existingFunctionIds.includes(id));

        if (missingFunctions.length > 0) {
            return res.status(400).json({ error: `Invalid function IDs: ${missingFunctions.join(", ")}` });
        }

        const sql = "INSERT INTO items (name, category_id, unit, price) VALUES (?, ?, ?, ?)";
        db.query(sql, [name, category_id, unit, price], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const itemId = result.insertId;
            const functionInsertSQL = "INSERT INTO item_functions (item_id, function_id) VALUES ?";
            const functionValues = function_ids.map(funcId => [itemId, funcId]);

            db.query(functionInsertSQL, [functionValues], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: "Item added successfully", id: itemId });
            });
        });
    });
});

// ✅ Update an Item (Protected) - Now with Function ID Validation
router.put("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const { name, category_id, function_ids, unit, price } = req.body;

    if (!name || !category_id || !function_ids || !Array.isArray(function_ids) || function_ids.length === 0 || !unit || !price) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const updateItemSQL = "UPDATE items SET name = ?, category_id = ?, unit = ?, price = ? WHERE id = ?";
    db.query(updateItemSQL, [name, category_id, unit, price, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found" });

        db.query("DELETE FROM item_functions WHERE item_id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            const functionInsertSQL = "INSERT INTO item_functions (item_id, function_id) VALUES ?";
            const functionValues = function_ids.map(funcId => [id, funcId]);

            db.query(functionInsertSQL, [functionValues], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Item updated successfully" });
            });
        });
    });
});

// ✅ Delete an Item (Protected)
router.delete("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM item_functions WHERE item_id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query("DELETE FROM items WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found" });
            res.json({ message: "Item deleted successfully" });
        });
    });
});

module.exports = router;
