const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const register = (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username dan password wajib diisi"
        });
    }

    const userRole = role || "user";

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mendaftar"
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Username sudah digunakan"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                [username, hashedPassword, userRole],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Gagal mendaftar"
                        });
                    }

                    res.status(201).json({
                        message: "Registrasi berhasil",
                        userId: result.insertId
                    });
                }
            );
        }
    );
};

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username dan password wajib diisi"
        });
    }

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal login"
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Username atau password salah"
                });
            }

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Username atau password salah"
                });
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            res.json({
                message: "Login berhasil",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        }
    );
};

const getProfile = (req, res) => {
    const userId = req.user.userId;

    db.query(
        "SELECT id, username, role, created_at FROM users WHERE id = ?",
        [userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengambil profil"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "User tidak ditemukan"
                });
            }

            res.json(results[0]);
        }
    );
};

const updateProfile = (req, res) => {
    const userId = req.user.userId;
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            message: "Username wajib diisi"
        });
    }

    db.query(
        "SELECT * FROM users WHERE username = ? AND id != ?",
        [username, userId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengupdate profil"
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Username sudah digunakan"
                });
            }

            db.query(
                "UPDATE users SET username = ? WHERE id = ?",
                [username, userId],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Gagal mengupdate profil"
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            message: "User tidak ditemukan"
                        });
                    }

                    res.json({
                        message: "Profil berhasil diupdate"
                    });
                }
            );
        }
    );
};

const changePassword = (req, res) => {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            message: "Password lama dan baru wajib diisi"
        });
    }

    db.query(
        "SELECT password FROM users WHERE id = ?",
        [userId],
        async (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal mengganti password"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "User tidak ditemukan"
                });
            }

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    message: "Password lama salah"
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            db.query(
                "UPDATE users SET password = ? WHERE id = ?",
                [hashedPassword, userId],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Gagal mengganti password"
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            message: "User tidak ditemukan"
                        });
                    }

                    res.json({
                        message: "Password berhasil diganti"
                    });
                }
            );
        }
    );
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};
