const db = require("../config/database");

// ✅ Get all departments
exports.getDepartments = (req, res) => {
  const sql = "SELECT * FROM departments";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ✅ Create a new department (admin only)
exports.createDepartment = (req, res) => {
  const { department_name } = req.body;

  if (!department_name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  const sql = "INSERT INTO departments (department_name) VALUES (?)";
  db.query(sql, [department_name], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: "Department already exists" });
      }
      return res.status(500).json(err);
    }
    res.json({
      message: "Department created successfully",
      departmentId: result.insertId
    });
  });
};

// ✅ Get issues by department
exports.getDeptIssues = (req, res) => {
  const deptId = req.params.id;
  const { status } = req.query;

  let sql = `
    SELECT issues.*, 
      departments.department_name,
      users.name as reporter_name,
      (SELECT COUNT(*) FROM upvotes WHERE upvotes.issue_id = issues.id) AS upvotes_count
    FROM issues
    LEFT JOIN departments ON issues.department_id = departments.id
    LEFT JOIN users ON issues.user_id = users.user_id
    WHERE issues.department_id = ?
  `;
  const params = [deptId];

  if (status && status !== 'all') {
    sql += " AND issues.status = ?";
    params.push(status);
  }

  sql += " ORDER BY issues.created_at DESC";

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ✅ Assign admin to a department
exports.assignAdminToDept = (req, res) => {
  const { user_id, department_id } = req.body;

  if (!user_id || !department_id) {
    return res.status(400).json({ message: "user_id and department_id are required" });
  }

  // First verify the department exists
  db.query("SELECT * FROM departments WHERE id = ?", [department_id], (err, deptResult) => {
    if (err) return res.status(500).json(err);
    if (deptResult.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Update user: set role to 'admin' and assign department
    const sql = "UPDATE users SET role = 'admin', department_id = ? WHERE user_id = ?";
    db.query(sql, [department_id, user_id], (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: `User ${user_id} assigned as admin to ${deptResult[0].department_name} department`
      });
    });
  });
};

// ✅ Get department statistics
exports.getDeptStats = (req, res) => {
  const deptId = req.params.id;

  const sql = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'in-progress' OR status = 'progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
    FROM issues
    WHERE department_id = ?
  `;

  db.query(sql, [deptId], (err, result) => {
    if (err) return res.status(500).json(err);

    // Also get department name
    db.query("SELECT department_name FROM departments WHERE id = ?", [deptId], (err, deptResult) => {
      if (err) return res.status(500).json(err);

      res.json({
        department_name: deptResult.length > 0 ? deptResult[0].department_name : 'Unknown',
        department_id: parseInt(deptId),
        ...result[0]
      });
    });
  });
};

// ✅ Get all admins in a department
exports.getDeptAdmins = (req, res) => {
  const deptId = req.params.id;

  const sql = `
    SELECT user_id, name, email, role, department_id, created_at
    FROM users
    WHERE role = 'admin' AND department_id = ?
  `;

  db.query(sql, [deptId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
