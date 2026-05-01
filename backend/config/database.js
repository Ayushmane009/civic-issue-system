const mysql = require("mysql2");
require("dotenv").config();

// Use environment variables for database credentials
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "civic_system"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err.message);
    } else {
        console.log("Database connected");

        // ===== AUTO-MIGRATION: Create/update tables on startup =====

        // 1. Create departments table
        db.query(`CREATE TABLE IF NOT EXISTS departments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            department_name VARCHAR(100) NOT NULL UNIQUE
        )`, (err) => {
            if (err) console.error("Error creating departments table:", err);
            else {
                console.log("Departments table ready");

                // Seed predefined departments (ignore duplicates)
                const departments = ['Infrastructure', 'Sanitization', 'Safety', 'Transport'];
                departments.forEach((name) => {
                    db.query(
                        "INSERT IGNORE INTO departments (department_name) VALUES (?)",
                        [name],
                        (err) => {
                            if (err) console.error(`Error seeding department '${name}':`, err);
                        }
                    );
                });
                console.log("Departments seeded");
            }
        });

        // 2. Ensure upvotes table exists
        db.query(`CREATE TABLE IF NOT EXISTS upvotes (
            user_id INT NOT NULL,
            issue_id INT NOT NULL,
            PRIMARY KEY (user_id, issue_id)
        )`, (err) => {
            if (err) console.error("Error creating upvotes table:", err);
            else console.log("Upvotes table ready");
        });

        // 3. Ensure issues table has lat and lng columns
        db.query("SHOW COLUMNS FROM issues LIKE 'lat'", (err, result) => {
            if (!err && result.length === 0) {
                db.query("ALTER TABLE issues ADD COLUMN lat DOUBLE AFTER location", (err) => {
                    if (err) console.error("Error adding lat column:", err);
                    else console.log("Lat column added to issues table");
                });
            }
        });

        db.query("SHOW COLUMNS FROM issues LIKE 'lng'", (err, result) => {
            if (!err && result.length === 0) {
                db.query("ALTER TABLE issues ADD COLUMN lng DOUBLE AFTER lat", (err) => {
                    if (err) console.error("Error adding lng column:", err);
                    else console.log("Lng column added to issues table");
                });
            }
        });

        // 4. Ensure issues table has priority column
        db.query("SHOW COLUMNS FROM issues LIKE 'priority'", (err, result) => {
            if (!err && result.length === 0) {
                db.query("ALTER TABLE issues ADD COLUMN priority VARCHAR(20) DEFAULT 'Medium' AFTER category", (err) => {
                    if (err) console.error("Error adding priority column:", err);
                    else console.log("Priority column added to issues table");
                });
            }
        });

        // 5. Add department_id column to users table (nullable — normal users don't have a department)
        db.query("SHOW COLUMNS FROM users LIKE 'department_id'", (err, result) => {
            if (!err && result.length === 0) {
                db.query("ALTER TABLE users ADD COLUMN department_id INT DEFAULT NULL", (err) => {
                    if (err) console.error("Error adding department_id to users:", err);
                    else console.log("department_id column added to users table");
                });
            }
        });

        // 6. Add department_id column to issues table
        db.query("SHOW COLUMNS FROM issues LIKE 'department_id'", (err, result) => {
            if (!err && result.length === 0) {
                db.query("ALTER TABLE issues ADD COLUMN department_id INT DEFAULT NULL", (err) => {
                    if (err) console.error("Error adding department_id to issues:", err);
                    else console.log("department_id column added to issues table");
                });
            }
        });

        // 7. Add remarks column to issues table (for admin comments)
        db.query("SHOW COLUMNS FROM issues LIKE 'remarks'", (err, result) => {
            if (!err && result.length === 0) {
                db.query("ALTER TABLE issues ADD COLUMN remarks TEXT DEFAULT NULL", (err) => {
                    if (err) console.error("Error adding remarks to issues:", err);
                    else console.log("Remarks column added to issues table");
                });
            }
        });
    }
});

module.exports = db;