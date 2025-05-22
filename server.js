const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/db");
const multer = require('multer');
const path = require('path');
require("dotenv").config();


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve image files

// Import Routes
const dashboardRoutes = require("./src/routes/dashboardRoutes"); 
const userRoutes = require("./src/routes/userRoutes"); // ✅ Updated
const itemRoutes = require("./src/routes/itemRoutes");
const functionRoutes = require("./src/routes/functionRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const unitRoutes = require("./src/routes/unitRoutes");
const productsRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

app.use("/dashboard", dashboardRoutes);
app.use("/users", userRoutes); // ✅ Updated path
app.use("/items", itemRoutes);
app.use("/functions", functionRoutes);
app.use("/categories", categoryRoutes);
app.use("/units", unitRoutes);
app.use("/products", productsRoutes);
app.use("/orders", orderRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to Ordering App API!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
