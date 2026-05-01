const db = require("../config/database");
const { sendEmail } = require("../utils/emailService");
const { getDepartmentIdFromCategory } = require("../utils/departmentMapping");

// ✅ REPORT ISSUE (with automatic department assignment)
exports.reportIssue = (req, res) => {

  const { title, description, location, category, lat, lng, priority } = req.body;
  const image = req.file ? req.file.filename : null;
  const user_id = req.user.id || req.user.user_id;

  // Auto-assign department based on category
  const department_id = getDepartmentIdFromCategory(category);

  const sql = `
    INSERT INTO issues (user_id, title, description, image, location, category, lat, lng, priority, department_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, title, description, image, location, category, lat, lng, priority || 'Medium', department_id], (err, result) => {

    if (err) return res.status(500).json(err);

    // ✅ SEND EMAIL NOTIFICATION (Production Practice: Don't block the response)
    // First, get user email from the database
    db.query("SELECT email FROM users WHERE user_id = ?", [user_id], (userErr, userResult) => {
      if (!userErr && userResult.length > 0) {
        const userEmail = userResult[0].email;

        // Trigger email service
        sendEmail({
          to: userEmail,
          subject: "Complaint Submitted",
          type: category,
          location: location,
          title: title
        }).catch(err => console.error("Email notification failed:", err));
      }
    });

    res.json({
      message: "Issue reported successfully",
      issueId: result.insertId,
      department_id: department_id
    });
  });
};

// ✅ GET ALL ISSUES (with department info)
exports.getAllIssues = (req, res) => {

  const sql = `
    SELECT issues.*, 
      departments.department_name,
      (SELECT COUNT(*) FROM upvotes WHERE upvotes.issue_id = issues.id) AS upvotes_count
    FROM issues
    LEFT JOIN departments ON issues.department_id = departments.id
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {

    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// ✅ GET ISSUES BY DEPARTMENT (for department admins)
exports.getIssuesByDepartment = (req, res) => {
  const deptId = req.params.deptId;
  const { status } = req.query; // Optional status filter

  let sql = `
    SELECT issues.*, 
      departments.department_name,
      users.name as reporter_name,
      users.email as reporter_email,
      (SELECT COUNT(*) FROM upvotes WHERE upvotes.issue_id = issues.id) AS upvotes_count
    FROM issues
    LEFT JOIN departments ON issues.department_id = departments.id
    LEFT JOIN users ON issues.user_id = users.user_id
    WHERE issues.department_id = ?
  `;
  const params = [deptId];

  // Add optional status filter
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

// ✅ GET ISSUE BY ID (with department info)
exports.getIssueById = (req, res) => {

  const issueId = req.params.id;

  const sql = `
    SELECT issues.*, 
      departments.department_name,
      (SELECT COUNT(*) FROM upvotes WHERE upvotes.issue_id = issues.id) AS upvotes_count
    FROM issues
    LEFT JOIN departments ON issues.department_id = departments.id
    WHERE issues.id = ?
  `;

  db.query(sql, [issueId], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const issue = result[0];

    // Fetch comments for this issue
    const sqlComments = `
      SELECT c.*, u.name as user_name 
      FROM comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.issue_id = ?
      ORDER BY c.created_at DESC
    `;

    db.query(sqlComments, [issueId], (err, commentResult) => {
      if (err) return res.status(500).json(err);
      
      issue.comments = commentResult;
      res.json(issue);
    });
  });
};

// ✅ UPDATE STATUS (department-scoped for admins)
exports.updateIssueStatus = (req, res) => {
  const userId = req.user.id || req.user.user_id;

  db.query("SELECT role, department_id FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const adminDeptId = result[0].department_id;
    const { issue_id, status, remarks } = req.body;

    // If admin has a department, check they can only update their department's issues
    if (adminDeptId) {
      db.query("SELECT department_id FROM issues WHERE id = ?", [issue_id], (err, issueResult) => {
        if (err) return res.status(500).json(err);
        if (issueResult.length === 0) return res.status(404).json({ message: "Issue not found" });

        if (issueResult[0].department_id !== adminDeptId) {
          return res.status(403).json({ message: "You can only manage issues in your department." });
        }

        // Update status (and optionally remarks)
        let sql = "UPDATE issues SET status = ?";
        const params = [status];

        if (remarks !== undefined) {
          sql += ", remarks = ?";
          params.push(remarks);
        }

        sql += " WHERE id = ?";
        params.push(issue_id);

        db.query(sql, params, (err, result) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Status updated" });
        });
      });
    } else {
      // Super admin (no department restriction) — can update any issue
      let sql = "UPDATE issues SET status = ?";
      const params = [status];

      if (remarks !== undefined) {
        sql += ", remarks = ?";
        params.push(remarks);
      }

      sql += " WHERE id = ?";
      params.push(issue_id);

      db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Status updated" });
      });
    }
  });
};

// ✅ UPDATE PRIORITY (department-scoped for admins)
exports.updateIssuePriority = (req, res) => {
  const userId = req.user.id || req.user.user_id;

  db.query("SELECT role, department_id FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const adminDeptId = result[0].department_id;
    const { issue_id, priority } = req.body;

    if (adminDeptId) {
      // Department admin — verify issue belongs to their department
      db.query("SELECT department_id FROM issues WHERE id = ?", [issue_id], (err, issueResult) => {
        if (err) return res.status(500).json(err);
        if (issueResult.length === 0) return res.status(404).json({ message: "Issue not found" });

        if (issueResult[0].department_id !== adminDeptId) {
          return res.status(403).json({ message: "You can only manage issues in your department." });
        }

        db.query("UPDATE issues SET priority = ? WHERE id = ?", [priority, issue_id], (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Priority updated" });
        });
      });
    } else {
      // Super admin
      db.query("UPDATE issues SET priority = ? WHERE id = ?", [priority, issue_id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Priority updated" });
      });
    }
  });
};

// ✅ ADD REMARKS (admin remarks/comments on an issue)
exports.addRemarks = (req, res) => {
  const userId = req.user.id || req.user.user_id;

  db.query("SELECT role, department_id FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { issue_id, remarks } = req.body;

    db.query("UPDATE issues SET remarks = ? WHERE id = ?", [remarks, issue_id], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Remarks added successfully" });
    });
  });
};

// ✅ DELETE ISSUE (department-scoped for admins)
exports.deleteIssue = (req, res) => {
  const userId = req.user.id || req.user.user_id;

  db.query("SELECT role, department_id FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const adminDeptId = result[0].department_id;
    const issueId = req.params.id;

    const performDelete = () => {
      // Delete comments first to avoid foreign key constraint errors
      const sqlDeleteComments = "DELETE FROM comments WHERE issue_id = ?";
      db.query(sqlDeleteComments, [issueId], (err) => {
        if (err) return res.status(500).json(err);

        // Delete upvotes
        db.query("DELETE FROM upvotes WHERE issue_id = ?", [issueId], (err) => {
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

    if (adminDeptId) {
      // Department admin — verify issue belongs to their department
      db.query("SELECT department_id FROM issues WHERE id = ?", [issueId], (err, issueResult) => {
        if (err) return res.status(500).json(err);
        if (issueResult.length === 0) return res.status(404).json({ message: "Issue not found" });

        if (issueResult[0].department_id !== adminDeptId) {
          return res.status(403).json({ message: "You can only delete issues in your department." });
        }

        performDelete();
      });
    } else {
      // Super admin
      performDelete();
    }
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

// ✅ TOGGLE UPVOTE
exports.toggleUpvote = (req, res) => {
  const issueId = req.params.id;
  const userId = req.user.id || req.user.user_id;

  // Check if upvote already exists
  db.query("SELECT * FROM upvotes WHERE user_id = ? AND issue_id = ?", [userId, issueId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      // User already upvoted, so remove it (downvote/undo)
      db.query("DELETE FROM upvotes WHERE user_id = ? AND issue_id = ?", [userId, issueId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Upvote removed", upvoted: false });
      });
    } else {
      // Add upvote
      db.query("INSERT INTO upvotes (user_id, issue_id) VALUES (?, ?)", [userId, issueId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Upvoted successfully", upvoted: true });
      });
    }
  });
};
