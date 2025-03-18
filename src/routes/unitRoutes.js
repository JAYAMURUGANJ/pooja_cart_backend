const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware
const controller = require("../controllers/unitController");
require("dotenv").config();

const router = express.Router();

router.get("/",authMiddleware, controller.getAllUnits);
router.get("/:id",authMiddleware,  controller.getUnitById);
router.post("/",authMiddleware, controller.createUnit);
router.put("/:id",authMiddleware,  controller.updateUnit);
router.delete("/:id",authMiddleware,  controller.deleteUnit);


module.exports = router;
