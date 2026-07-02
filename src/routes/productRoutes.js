const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const { authenticateToken, requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticateToken, requireAdmin, upload.single("image"), createProduct);
router.put("/:id", authenticateToken, requireAdmin, upload.single("image"), updateProduct);
router.delete("/:id", authenticateToken, requireAdmin, deleteProduct);

module.exports = router;