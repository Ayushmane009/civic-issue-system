const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./database.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {

      const email = profile.emails[0].value;
      const name = profile.displayName;

      const checkUser = "SELECT * FROM users WHERE email = ?";

      db.query(checkUser, [email], (err, result) => {

        if (result.length > 0) {
          // Return full user object including role and department_id
          return done(null, result[0]);
        } else {

          const insertUser =
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

          db.query(insertUser, [name, email, "google_auth"], (err, newUser) => {

            return done(null, {
              user_id: newUser.insertId,
              name,
              email,
              role: 'user',
              department_id: null
            });
          });
        }
      });
    }
  )
);

module.exports = passport;