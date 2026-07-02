const express = require("express");
const router = express.Router();

const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");

const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, getCart);
router.post("/", authenticateToken, addToCart);
router.put("/:id", authenticateToken, updateCartItem);
router.delete("/:id", authenticateToken, removeCartItem);
router.delete("/", authenticateToken, clearCart);

module.exports = router;
