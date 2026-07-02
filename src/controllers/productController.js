const db = require("../config/database");
const upload = require("../middleware/upload");

const getProducts = (req, res) => {
    db.query(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
    `, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Gagal mengambil data"
            });
        }

        res.json(results);
    });
};

const getProductById = (req, res) => {
    const { id } = req.params;

    db.query(
        `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
        `,
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengambil produk"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Produk tidak ditemukan"
                });
            }

            res.json(results[0]);
        }
    );
};

const createProduct = (req, res) => {
    const { name, description, price, stock, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    const query = `
        INSERT INTO products (name, description, price, stock, category_id, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [name, description, price, stock, category_id || 1, image],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal menambah produk"
                });
            }

            res.status(201).json({
                message: "Produk berhasil ditambahkan",
                id: result.insertId
            });
        }
    );
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    let query, params;

    if (image) {
        query = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image = ?
            WHERE id = ?
        `;
        params = [name, description, price, stock, category_id || 1, image, id];
    } else {
        query = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
            WHERE id = ?
        `;
        params = [name, description, price, stock, category_id || 1, id];
    }

    db.query(
        query,
        params,
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengupdate produk"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Produk tidak ditemukan"
                });
            }

            res.json({
                message: "Produk berhasil diupdate"
            });
        }
    );
};

const deleteProduct = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM products WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal menghapus produk"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Produk tidak ditemukan"
                });
            }

            res.json({
                message: "Produk berhasil dihapus"
            });
        }
    );
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};