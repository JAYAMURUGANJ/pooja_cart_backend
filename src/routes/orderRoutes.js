const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware
const controller = require("../controllers/orderController");
require("dotenv").config();

const router = express.Router();

// Order routes
router.post('/place_order',authMiddleware, controller.createOrder);
router.get('/user/:user_id', authMiddleware, controller.getUserOrders);
router.get('/:id', authMiddleware, controller.getOrderById);
router.patch('/:id/status', authMiddleware, controller.updateOrderStatus);

module.exports = router;
