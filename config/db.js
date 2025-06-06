const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.MYSQL_ADDON_PORT,
    connectTimeout: 100000 
});

db.connect((err) => {
    if (err) {
        console.error("MySQL Connection Failed:", err);
    } else {
        console.log("✅ MySQL Connected...");
    }
});

module.exports = db;
