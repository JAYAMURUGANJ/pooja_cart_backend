const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Import Routes
const userRoutes = require("./src/routes/userRoutes"); // ✅ Updated
const itemRoutes = require("./src/routes/itemRoutes");
const functionRoutes = require("./src/routes/functionRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");

app.use("/users", userRoutes); // ✅ Updated path
app.use("/items", itemRoutes);
app.use("/functions", functionRoutes);
app.use("/categories", categoryRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to Ordering App API!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
