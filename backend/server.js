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

// ----------- AUTH HELPERS ----------
function signToken(username, role) {
  return jwt.sign({ username, role }, SECRET, { expiresIn: "6h" });
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "no_token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid_token" });
  }
}

// ----------- AUTH ROUTES ----------
app.post("/api/signup", (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "missing_fields" });

  try {
    const exists = findUser(username);
    if (exists) return res.status(400).json({ error: "user_exists" });

    const u = addUser(username, password, "user", email);
    const token = signToken(username, "user");

    res.json({ token, username: u.username, role: "user" });
  } catch (err) {
    console.error("signup err:", err);
    res.status(500).json({ error: "signup_failed" });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const u = findUser(username);

  if (!u) return res.status(401).json({ error: "invalid_credentials" });

  const ok = bcrypt.compareSync(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  const token = signToken(u.username, u.role || "user");
  res.json({ token, username: u.username, role: u.role });
});

// ----------- DASHBOARD ROUTE ----------
app.get("/api/dashboard", verifyToken, (req, res) => {
  try {
    const inv = db.prepare("SELECT * FROM inventory").all();
    const lowStock = inv.filter(i => i.stock < 10).length;

    const metrics = db.prepare("SELECT * FROM metrics ORDER BY id DESC LIMIT 1").get() || {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      syscall_rate: Math.floor(Math.random() * 500)
    };

    res.json({
      items: inv.length,
      low_stock: lowStock,
      users: db.prepare("SELECT COUNT(*) AS c FROM users").get().c,
      alerts: [
        { label: "A1", value: 1 },
        { label: "A2", value: 2 },
        { label: "A3", value: 1 }
      ],
      system: {
        cpu: metrics.cpu,
        memory: metrics.memory,
        syscalls: metrics.syscall_rate
      }
    });
  } catch (e) {
    console.error("dashboard error:", e);
    res.status(500).json({ error: "dashboard_failed" });
  }
});

// ----------- INVENTORY ----------
app.get("/api/inventory", verifyToken, (req, res) => {
  const rows = db.prepare("SELECT * FROM inventory").all();
  res.json(rows);
});

// ----------- SYSTEM STATS ----------
app.get("/api/system-stats", verifyToken, (req, res) => {
  const row = db.prepare("SELECT * FROM metrics ORDER BY id DESC LIMIT 1").get();
  res.json(row || {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    syscall_rate: Math.floor(Math.random() * 400)
  });
});

// ----------- OPTIMIZATION TIPS ----------
app.get("/api/optimization-tips", verifyToken, (req, res) => {
  const tips = [
    "Reduce high syscall rates by batching I/O operations.",
    "Optimize long-running syscalls.",
    "Avoid unnecessary context switches.",
    "Use caching to reduce repeated calls.",
    "Prefer asynchronous I/O to avoid blocking."
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  res.json({ tip });
});

// ----------- PREDICTION ----------
app.post("/api/predict", verifyToken, (req, res) => {
  const payload = JSON.stringify({
    pid: Number(req.body.pid || 0),
    tid: Number(req.body.tid || 0),
    syscall_id: Number(req.body.syscall_id || 0),
    latency_prev1: Number(req.body.latency_prev1 || 0),
    latency_prev2: Number(req.body.latency_prev2 || 0),
    delta_idx: Number(req.body.delta_idx || 1),
    inv_delta: Number(req.body.inv_delta || 1.0)
  });

  const py = spawn("python3.11", ["/home/ankit06/ml-model/predict.py", payload]);

  let out = "";
  let err = "";

  py.stdout.on("data", d => out += d);
  py.stderr.on("data", d => err += d);

  py.on("close", () => {
    if (err) console.error("PYTHON ERR:", err);

    try {
      res.json(JSON.parse(out));
    } catch {
      res.status(500).json({ error: "predict_failed" });
    }
  });
});

app.listen(5005, () => console.log("Backend running on http://localhost:5005"));
