const express = require("express");
const router = express.Router();

const {
    checkout,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders
} = require("../controllers/orderController");

const { authenticateToken, requireAdmin } = require("../middleware/auth");

router.post("/checkout", authenticateToken, checkout);
router.get("/", authenticateToken, getOrders);
router.get("/:id", authenticateToken, getOrderById);
router.put("/:id/status", authenticateToken, requireAdmin, updateOrderStatus);
router.get("/all/orders", authenticateToken, requireAdmin, getAllOrders);

module.exports = router;
