const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const db = require("../config/database");
const router = express.Router();
const { registerUser, loginUser, getUserUpvotes } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile endpoint — includes department info
router.get("/profile", verifyToken, (req, res) => {
  const userId = req.user.user_id || req.user.id;
  const sql = `
    SELECT users.user_id, users.name, users.email, users.role, 
           users.department_id, users.created_at,
           departments.department_name
    FROM users
    LEFT JOIN departments ON users.department_id = departments.id
    WHERE users.user_id = ?
  `;
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result[0]);
  });
});

router.get("/upvotes", verifyToken, getUserUpvotes);

module.exports = router;
