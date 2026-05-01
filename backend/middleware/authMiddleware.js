const jwt = require("jsonwebtoken");
const db = require("../config/database");

/**
 * Verify JWT token from Authorization header.
 * Attaches decoded user data to req.user
 */
exports.verifyToken = (req, res, next) => {

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    req.user = decoded; // 👈 VERY IMPORTANT

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

/**
 * Check if the authenticated user is an admin.
 * Must be used AFTER verifyToken middleware.
 */
exports.isAdmin = (req, res, next) => {
  const userId = req.user.id || req.user.user_id;

  db.query("SELECT role FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0 || result[0].role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  });
};

/**
 * Check if the admin belongs to the department of the issue.
 * Reads department_id from req.body.department_id or req.params.deptId.
 * Must be used AFTER verifyToken middleware.
 */
exports.isDeptAdmin = (req, res, next) => {
  const userId = req.user.id || req.user.user_id;

  db.query(
    "SELECT role, department_id FROM users WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.length === 0 || result[0].role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }

      // Attach admin's department_id to request for downstream use
      req.adminDepartmentId = result[0].department_id;
      next();
    }
  );
};