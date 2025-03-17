const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Not authorized. Please log in." });
    }

    const tokenValue = token.replace("Bearer ", "");

    // Check if token is blacklisted
    const sql = "SELECT * FROM token_blacklist WHERE token = ?";
    db.query(sql, [tokenValue], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.status(401).json({ error: "Token expired. Please log in again." });
        }

        try {
            const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
            req.user = decoded; // Store user info in request
            next();
        } catch (err) {
            res.status(401).json({ error: "Invalid token. Please log in again." });
        }
    });
};

module.exports = authMiddleware;
