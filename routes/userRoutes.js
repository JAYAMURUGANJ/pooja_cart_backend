const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware
require("dotenv").config();

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password and insert new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "User registered successfully" });
        });
    });
});

// ✅ Login User
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, results[0].password);
        if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: results[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, message: "Login successful" });
    });
});

// ✅ Logout User (Blacklist Token)
router.post("/logout", authMiddleware, (req, res) => {
    const token = req.header("Authorization").replace("Bearer ", "");

    const sql = "INSERT INTO token_blacklist (token) VALUES (?)";
    db.query(sql, [token], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Logout successful. Token has been blacklisted." });
    });
});

module.exports = router;
