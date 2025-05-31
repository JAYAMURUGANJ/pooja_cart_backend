const express = require("express");
const db = require("../../config/db");
const controller = require("../controllers/reportController");

const router = express.Router();

// ✅ Get Dashboard Content
router.get("/", controller.getReportContent);

module.exports = router;
