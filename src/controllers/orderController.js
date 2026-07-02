const db = require("../config/database");

const checkout = (req, res) => {
    const userId = req.user.userId;

    db.query(
        `SELECT ci.*, p.name, p.stock 
         FROM cart_items ci 
         JOIN products p ON ci.product_id = p.id 
         JOIN carts ON ci.cart_id = carts.id 
         WHERE carts.user_id = ?`,
        [userId],
        (err, cartItems) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal melakukan checkout"
                });
            }

            if (cartItems.length === 0) {
                return res.status(400).json({
                    message: "Keranjang kosong"
                });
            }

            // Check stock availability
            for (const item of cartItems) {
                if (item.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Stok tidak cukup untuk ${item.name}`
                    });
                }
            }

            // Calculate total
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Start transaction
            db.beginTransaction((err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Gagal melakukan checkout"
                    });
                }

                // Create order
                db.query(
                    "INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')",
                    [userId, total],
                    (err, orderResult) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({
                                    message: "Gagal membuat pesanan"
                                });
                            });
                        }

                        const orderId = orderResult.insertId;

                        // Create order items and reduce stock
                        let completedItems = 0;
                        cartItems.forEach((item) => {
                            // Insert order item
                            db.query(
                                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                                [orderId, item.product_id, item.quantity, item.price],
                                (err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            res.status(500).json({
                                                message: "Gagal membuat item pesanan"
                                            });
                                        });
                                    }

                                    // Reduce product stock
                                    db.query(
                                        "UPDATE products SET stock = stock - ? WHERE id = ?",
                                        [item.quantity, item.product_id],
                                        (err) => {
                                            if (err) {
                                                return db.rollback(() => {
                                                    res.status(500).json({
                                                        message: "Gagal mengurangi stok"
                                                    });
                                                });
                                            }

                                            completedItems++;
                                            if (completedItems === cartItems.length) {
                                                // Clear cart
                                                db.query(
                                                    `DELETE cart_items FROM cart_items 
                                                     JOIN carts ON cart_items.cart_id = carts.id 
                                                     WHERE carts.user_id = ?`,
                                                    [userId],
                                                    (err) => {
                                                        if (err) {
                                                            return db.rollback(() => {
                                                                res.status(500).json({
                                                                    message: "Gagal mengosongkan keranjang"
                                                                });
                                                            });
                                                        }

                                                        db.commit((err) => {
                                                            if (err) {
                                                                return db.rollback(() => {
                                                                    res.status(500).json({
                                                                        message: "Gagal melakukan checkout"
                                                                    });
                                                                });
                                                            }

                                                            res.json({
                                                                message: "Checkout berhasil",
                                                                orderId: orderId,
                                                                total: total
                                                            });
                                                        });
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            );
                        });
                    }
                );
            });
        }
    );
};

const getOrders = (req, res) => {
    const userId = req.user.userId;

    db.query(
        `SELECT o.*, oi.product_id, oi.quantity, oi.price as item_price, p.name as product_name 
         FROM orders o 
         LEFT JOIN order_items oi ON o.id = oi.order_id 
         LEFT JOIN products p ON oi.product_id = p.id 
         WHERE o.user_id = ? 
         ORDER BY o.created_at DESC`,
        [userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengambil pesanan"
                });
            }

            res.json(results);
        }
    );
};

const getOrderById = (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    db.query(
        `SELECT o.*, oi.product_id, oi.quantity, oi.price as item_price, p.name as product_name, p.image 
         FROM orders o 
         LEFT JOIN order_items oi ON o.id = oi.order_id 
         LEFT JOIN products p ON oi.product_id = p.id 
         WHERE o.id = ? AND o.user_id = ?`,
        [id, userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengambil pesanan"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Pesanan tidak ditemukan"
                });
            }

            res.json(results);
        }
    );
};

const updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            message: "Status wajib diisi"
        });
    }

    const validStatuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: "Status tidak valid"
        });
    }

    db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengupdate status pesanan"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Pesanan tidak ditemukan"
                });
            }

            res.json({
                message: "Status pesanan berhasil diupdate"
            });
        }
    );
};

const getAllOrders = (req, res) => {
    db.query(
        `SELECT o.*, oi.product_id, oi.quantity, oi.price as item_price, p.name as product_name, p.image, u.username 
         FROM orders o 
         LEFT JOIN order_items oi ON o.id = oi.order_id 
         LEFT JOIN products p ON oi.product_id = p.id 
         LEFT JOIN users u ON o.user_id = u.id 
         ORDER BY o.created_at DESC`,
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengambil semua pesanan"
                });
            }

            res.json(results);
        }
    );
};

module.exports = {
    checkout,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders
};
