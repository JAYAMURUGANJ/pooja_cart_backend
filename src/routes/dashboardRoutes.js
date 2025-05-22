const express = require("express");
const db = require("../../config/db");
const controller = require("../controllers/dashboardController");

const router = express.Router();

// ✅ Get Dashboard Content
router.get("/", controller.getDashboardContent);

module.exports = router;
