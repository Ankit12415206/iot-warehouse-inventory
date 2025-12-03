// Run once to create data/app.db and seed admin user
const fs = require("fs");
const path = require("path");
const dbFile = path.join(__dirname, "data", "app.db");
const { execSync } = require("child_process");
if (!fs.existsSync(path.join(__dirname, "data"))) fs.mkdirSync(path.join(__dirname, "data"));
console.log("Initializing DB:", dbFile);
const Database = require("better-sqlite3");
const db = new Database(dbFile);
db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
const bcrypt = require("bcryptjs");
const hash = bcrypt.hashSync("admin123", 10);
try {
  db.prepare("INSERT INTO users (username,password_hash,role,email) VALUES (?,?,?,?)")
    .run("admin", hash, "admin", "admin@example.com");
} catch(e){ /* ignore duplicate */ }
console.log("Database initialized");