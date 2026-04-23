const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const db = require("../config/database");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, (req, res) => {
  const userId = req.user.user_id || req.user.id;
  const sql = "SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result[0]);
  });
});

module.exports = router;

