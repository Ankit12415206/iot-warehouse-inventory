const bcrypt = require("bcryptjs");

let users = [
  {
    username: "admin",
    passwordHash: bcrypt.hashSync("admin123", 10)
  }
];

function findUser(username) {
  return users.find(u => u.username === username);
}

function addUser(username, password) {
  const hash = bcrypt.hashSync(password, 10);
  users.push({ username, passwordHash: hash });
}

function updatePassword(username, newPassword) {
  const u = findUser(username);
  if (!u) return false;

  u.passwordHash = bcrypt.hashSync(newPassword, 10);
  return true;
}

module.exports = { users, addUser, findUser, updatePassword };
