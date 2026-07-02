const express = require("express");
const router = express.Router();

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const { authenticateToken, requireAdmin } = require("../middleware/auth");

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", authenticateToken, requireAdmin, createCategory);
router.put("/:id", authenticateToken, requireAdmin, updateCategory);
router.delete("/:id", authenticateToken, requireAdmin, deleteCategory);

module.exports = router;
