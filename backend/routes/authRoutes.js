const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = jwt.sign(
      { id: req.user.user_id, email: req.user.email },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

module.exports = router;