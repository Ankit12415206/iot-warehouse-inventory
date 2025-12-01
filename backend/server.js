const express = require("express");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");
const db = require("./db");
const { findUser, addUser, updatePassword, listUsers } = require("./users_sql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "SECRET123";

// ---------------- AUTH ------------------

function signToken(username, role) {
  return jwt.sign({ username, role }, SECRET, { expiresIn: "6h" });
}

app.post("/api/signup", (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) return res.status(400).json({ error: "missing_fields" });

  const exists = findUser(username);
  if (exists) return res.status(400).json({ error: "user_exists" });

  addUser(username, password, "user", email);
  res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const u = findUser(username);

  if (!u) return res.status(401).json({ error: "invalid_credentials" });

  const ok = bcrypt.compareSync(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  const token = signToken(u.username, u.role);
  res.json({ token, username: u.username, role: u.role });
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "no_token" });

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
}

// ---------------- DASHBOARD ------------------

app.get("/api/dashboard", verifyToken, (req, res) => {
  const invCount = db.prepare("SELECT COUNT(*) as c FROM inventory").get().c;
  const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get().c;
  const last = db.prepare("SELECT * FROM metrics ORDER BY id DESC LIMIT 1").get() || {
    cpu: 0,
    memory: 0,
    syscall_rate: 0
  };

  res.json({
    totalInventoryItems: invCount,
    totalUsers: userCount,
    latestMetrics: last,
    alerts: []
  });
});

// ---------------- SYSTEM STATS ------------------

app.get("/api/system-stats", verifyToken, (req, res) => {
  const row = db.prepare("SELECT * FROM metrics ORDER BY id DESC LIMIT 1").get();

  res.json(row || {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    syscall_rate: Math.random() * 200
  });
});

// ---------------- INVENTORY ------------------

app.get("/api/inventory", verifyToken, (req, res) => {
  const rows = db.prepare("SELECT * FROM inventory").all();
  res.json(rows);
});

// ---------------- OPTIMIZATION TIPS ------------------

app.get("/api/optimization-tips", verifyToken, (req, res) => {
  res.json({
    tip: "Reduce high syscall rates by batching operations."
  });
});

// ---------------- PREDICT ------------------

app.post("/api/predict", verifyToken, (req, res) => {
  const payload = JSON.stringify(req.body);
  const py = spawn("python3.11", ["ml-model/predict.py", payload], {
    cwd: path.join(__dirname)
  });

  let out = "";
  let err = "";

  py.stdout.on("data", d => out += d.toString());
  py.stderr.on("data", d => err += d.toString());

  py.on("close", () => {
    if (err) console.error("PY ERR:", err);
    try {
      res.json(JSON.parse(out));
    } catch {
      res.status(500).json({ error: "predict_failed" });
    }
  });
});

// ---------------- SERVER ------------------

app.listen(5005, () => console.log("Backend running at http://localhost:5005"));
