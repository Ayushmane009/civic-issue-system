const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded; // 👈 VERY IMPORTANT

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};