const db = require("../config/database");

const getCart = (req, res) => {
    const userId = req.user.userId;

    db.query(
        `SELECT ci.*, p.name, p.description, p.image, c.name as category_name 
         FROM cart_items ci 
         JOIN products p ON ci.product_id = p.id 
         LEFT JOIN categories c ON p.category_id = c.id
         JOIN carts ON ci.cart_id = carts.id 
         WHERE carts.user_id = ?`,
        [userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengambil keranjang"
                });
            }

            res.json(results);
        }
    );
};

const addToCart = (req, res) => {
    const userId = req.user.userId;
    const { product_id, quantity } = req.body;

    if (!product_id) {
        return res.status(400).json({
            message: "Product ID wajib diisi"
        });
    }

    const cartQuantity = quantity || 1;

    db.query(
        "SELECT id FROM carts WHERE user_id = ?",
        [userId],
        (err, cartResults) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal menambah ke keranjang"
                });
            }

            let cartId;
            if (cartResults.length === 0) {
                db.query(
                    "INSERT INTO carts (user_id) VALUES (?)",
                    [userId],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                message: "Gagal membuat keranjang"
                            });
                        }
                        cartId = result.insertId;
                        addCartItem(cartId, product_id, cartQuantity, res);
                    }
                );
            } else {
                cartId = cartResults[0].id;
                
                db.query(
                    "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
                    [cartId, product_id],
                    (err, itemResults) => {
                        if (err) {
                            return res.status(500).json({
                                message: "Gagal menambah ke keranjang"
                            });
                        }

                        if (itemResults.length > 0) {
                            const newQuantity = itemResults[0].quantity + cartQuantity;
                            db.query(
                                "UPDATE cart_items SET quantity = ? WHERE id = ?",
                                [newQuantity, itemResults[0].id],
                                (err) => {
                                    if (err) {
                                        return res.status(500).json({
                                            message: "Gagal menambah ke keranjang"
                                        });
                                    }
                                    res.json({
                                        message: "Jumlah produk di keranjang diperbarui"
                                    });
                                }
                            );
                        } else {
                            addCartItem(cartId, product_id, cartQuantity, res);
                        }
                    }
                );
            }
        }
    );
};

function addCartItem(cartId, productId, quantity, res) {
    db.query(
        "SELECT price FROM products WHERE id = ?",
        [productId],
        (err, productResults) => {
            if (err || productResults.length === 0) {
                return res.status(500).json({
                    message: "Gagal menambah ke keranjang"
                });
            }

            const price = productResults[0].price;

            db.query(
                "INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                [cartId, productId, quantity, price],
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Gagal menambah ke keranjang"
                        });
                    }
                    res.json({
                        message: "Produk berhasil ditambahkan ke keranjang"
                    });
                }
            );
        }
    );
}

const updateCartItem = (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({
            message: "Quantity harus lebih dari 0"
        });
    }

    db.query(
        "UPDATE cart_items SET quantity = ? WHERE id = ?",
        [quantity, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengupdate item keranjang"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Item keranjang tidak ditemukan"
                });
            }

            res.json({
                message: "Item keranjang berhasil diupdate"
            });
        }
    );
};

const removeCartItem = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM cart_items WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal menghapus item keranjang"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Item keranjang tidak ditemukan"
                });
            }

            res.json({
                message: "Item keranjang berhasil dihapus"
            });
        }
    );
};

const clearCart = (req, res) => {
    const userId = req.user.userId;

    db.query(
        `DELETE cart_items FROM cart_items 
         JOIN carts ON cart_items.cart_id = carts.id 
         WHERE carts.user_id = ?`,
        [userId],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengosongkan keranjang"
                });
            }

            res.json({
                message: "Keranjang berhasil dikosongkan"
            });
        }
    );
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};
