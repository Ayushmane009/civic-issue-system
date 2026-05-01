const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into DB
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "User registered successfully" });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Join with departments to get department info
  const sql = `
    SELECT users.*, departments.department_name 
    FROM users 
    LEFT JOIN departments ON users.department_id = departments.id 
    WHERE users.email = ?
  `;

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // generate token — include department_id for admin users
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        id: user.user_id, 
        email: user.email, 
        role: user.role,
        department_id: user.department_id 
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        department_id: user.department_id,
        department_name: user.department_name
      }
    });
  });
};

exports.getUserUpvotes = (req, res) => {
  const userId = req.user.id || req.user.user_id;
  const sql = "SELECT issue_id FROM upvotes WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.map(row => row.issue_id));
  });
};
