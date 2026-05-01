const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback — includes role and department_id in JWT
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = jwt.sign(
      { 
        id: req.user.user_id, 
        email: req.user.email,
        role: req.user.role || 'user',
        department_id: req.user.department_id || null
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

module.exports = router;