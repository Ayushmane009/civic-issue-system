const mysql = require('mysql2');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ayushmane_009@",
    database: "civic_system"
});

db.connect((err) => {
    if (err) {
        console.error("Connection failed:", err);
        process.exit(1);
    }
    db.query("SELECT * FROM issues", (err, results) => {
        if (err) {
            console.error("Query failed:", err);
            process.exit(1);
        }
        console.log("ISSUE_COUNT:" + results.length);
        console.log("ISSUES:" + JSON.stringify(results));
        db.end();
    });
});
