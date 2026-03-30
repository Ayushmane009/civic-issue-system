const db = require("../config/database");

// Get all departments
exports.getDepartments = (req, res) => {
  const sql = "SELECT * FROM departments";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Get issues by department
exports.getDeptIssues = (req, res) => {
  const deptId = req.params.id;
  const sql = "SELECT * FROM issues WHERE dept_id = ? ORDER BY created_at DESC";
  db.query(sql, [deptId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

