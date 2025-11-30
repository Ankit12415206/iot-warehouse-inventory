const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// TEMP USER (can be saved in database later)
const USER = {
  username: "admin",
  passwordHash: bcrypt.hashSync("admin123", 10), // password = admin123
};

// Generate JWT token
function generateToken(user) {
  return jwt.sign({ username: user.username }, "SECRET123", { expiresIn: "1h" });
}

// Middleware: verify token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, "SECRET123", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    req.user = decoded;
    next();
  });
}

module.exports = { USER, generateToken, verifyToken };
