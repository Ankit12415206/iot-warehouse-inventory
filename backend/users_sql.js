const db = require("./db");
const bcrypt = require("bcryptjs");

function findUser(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

function addUser(username, password, role = "user", email = null) {
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO users (username,password_hash,role,email) VALUES (?,?,?,?)")
    .run(username, hash, role, email);

  return { username, role, email };
}

function updatePassword(username, newPassword) {
  const hash = bcrypt.hashSync(newPassword, 10);
  return db.prepare("UPDATE users SET password_hash=? WHERE username=?")
    .run(hash, username).changes > 0;
}

function listUsers() {
  return db.prepare("SELECT id, username, role, email FROM users").all();
}

module.exports = { findUser, addUser, updatePassword, listUsers };
