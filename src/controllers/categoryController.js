const db = require("../config/database");

const getCategories = (req, res) => {
    db.query("SELECT * FROM categories ORDER BY name", (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Gagal mengambil data kategori"
            });
        }

        res.json(results);
    });
};

const getCategoryById = (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM categories WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengambil kategori"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Kategori tidak ditemukan"
                });
            }

            res.json(results[0]);
        }
    );
};

const createCategory = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Nama kategori wajib diisi"
        });
    }

    db.query(
        "INSERT INTO categories (name) VALUES (?)",
        [name],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal menambah kategori"
                });
            }

            res.status(201).json({
                message: "Kategori berhasil ditambahkan",
                id: result.insertId
            });
        }
    );
};

const updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Nama kategori wajib diisi"
        });
    }

    db.query(
        "UPDATE categories SET name = ? WHERE id = ?",
        [name, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengupdate kategori"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Kategori tidak ditemukan"
                });
            }

            res.json({
                message: "Kategori berhasil diupdate"
            });
        }
    );
};

const deleteCategory = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM categories WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal menghapus kategori"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Kategori tidak ditemukan"
                });
            }

            res.json({
                message: "Kategori berhasil dihapus"
            });
        }
    );
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
