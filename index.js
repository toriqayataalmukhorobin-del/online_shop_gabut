require("dotenv").config();

const express = require("express");
const db = require("./src/config/database");

const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.json({
        message: "API Toko Online Berjalan",
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});