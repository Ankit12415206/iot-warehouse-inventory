// Simple wrapper for better-sqlite3 DB used by server
const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "data", "app.db");
const db = new Database(dbPath);

// Ensure schema exists (init_db.js will also create, but this is safe)
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT,
  role TEXT,
  email TEXT
);
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  stock INTEGER,
  category TEXT,
  status TEXT
);
CREATE TABLE IF NOT EXISTS benchmark_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT,
  latency_ms INTEGER,
  syscalls INTEGER
);
CREATE TABLE IF NOT EXISTS metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT,
  cpu REAL,
  memory REAL,
  syscall_rate INTEGER,
  source TEXT
);
`);
module.exports = db;
