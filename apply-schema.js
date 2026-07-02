require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }

    console.log("Connected to database");

    const fs = require("fs");
    const schema = fs.readFileSync("./database-schema.sql", "utf8");

    connection.query(schema, (err, results) => {
        if (err) {
            console.error("Error applying schema:", err.message);
            connection.end();
            process.exit(1);
        }

        console.log("✓ Database schema applied successfully");
        
        connection.query("SELECT * FROM categories", (err, results) => {
            if (err) {
                console.error("Error checking categories:", err.message);
            } else {
                console.log("✓ Categories created:", results.length);
                results.forEach(cat => console.log(`  - ${cat.id}: ${cat.name}`));
            }
            connection.end();
        });
    });
});
