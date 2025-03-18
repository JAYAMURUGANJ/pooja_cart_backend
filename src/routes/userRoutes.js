const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware
const controller = require("../controllers/userController");
require("dotenv").config();

const router = express.Router();

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/logout",authMiddleware, controller.logoutUser);

module.exports = router;
