const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ayushmane_009@",
    database: "civic_system"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
    } else {
        console.log("Database connected");
        // Ensure upvotes table exists
        db.query(`CREATE TABLE IF NOT EXISTS upvotes (
            user_id INT NOT NULL,
            issue_id INT NOT NULL,
            PRIMARY KEY (user_id, issue_id)
        )`, (err) => {
            if (err) console.error("Error creating upvotes table:", err);
            else console.log("Upvotes table ready");
        });
    }
});

module.exports = db;