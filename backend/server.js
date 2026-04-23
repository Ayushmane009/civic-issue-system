require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

require("./config/database");

const userRoutes = require("./routes/userRoutes");
const issueRoutes = require("./routes/issueRoutes");
const authRoutes = require("./routes/authRoutes");

const passport = require("./config/passport");
const session = require("express-session");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.JWT_SECRET || "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/departments", require("./routes/deptRoutes"));
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Civic Issue Reporting API Running on port 5000" });
});

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

