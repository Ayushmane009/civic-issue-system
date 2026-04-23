const db = require("../config/database");

// ✅ REPORT ISSUE
exports.reportIssue = (req, res) => {

  const { title, description, location, category } = req.body;
  const image = req.file ? req.file.filename : null;
  const user_id = req.user.id || req.user.user_id;

  const sql = `
    INSERT INTO issues (user_id, title, description, image, location, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, title, description, image, location, category], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Issue reported successfully",
      issueId: result.insertId
    });
  });
};

// ✅ GET ALL ISSUES
exports.getAllIssues = (req, res) => {

  const sql = "SELECT * FROM issues ORDER BY created_at DESC";

  db.query(sql, (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// ✅ GET ISSUE BY ID
exports.getIssueById = (req, res) => {

  const issueId = req.params.id;

  const sql = "SELECT * FROM issues WHERE id = ?";

  db.query(sql, [issueId], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(result[0]);
  });
};

// ✅ UPDATE STATUS
exports.updateIssueStatus = (req, res) => {
  const userId = req.user.id || req.user.user_id;

  db.query("SELECT role FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { issue_id, status } = req.body;

    const sql = "UPDATE issues SET status = ? WHERE id = ?";

    db.query(sql, [status, issue_id], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Status updated"
      });
    });
  });
};

// ✅ DELETE ISSUE
exports.deleteIssue = (req, res) => {
  const userId = req.user.id || req.user.user_id;

  db.query("SELECT role FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const issueId = req.params.id;

    // Delete comments first to avoid foreign key constraint errors
    const sqlDeleteComments = "DELETE FROM comments WHERE issue_id = ?";
    db.query(sqlDeleteComments, [issueId], (err) => {
      if (err) return res.status(500).json(err);

      // Then delete the issue
      const sqlDeleteIssue = "DELETE FROM issues WHERE id = ?";
      db.query(sqlDeleteIssue, [issueId], (err, result) => {
        if (err) return res.status(500).json(err);
        
        res.json({ message: "Issue deleted successfully" });
      });
    });
  });
};

// ✅ ADD COMMENT
exports.addComment = (req, res) => {

  const { issue_id, comment } = req.body;
  const user_id = req.user.id || req.user.user_id;

  const sql = `
    INSERT INTO comments (issue_id, user_id, comment)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [issue_id, user_id, comment], (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Comment added"
    });
  });
};

