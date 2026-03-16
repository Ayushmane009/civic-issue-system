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
    }
});

module.exports = db;