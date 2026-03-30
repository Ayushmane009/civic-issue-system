const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", (req, res) => {
  res.json(req.user || { message: 'No user' });
});

module.exports = router;

