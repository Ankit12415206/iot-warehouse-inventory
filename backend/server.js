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
const ML_PY = "/home/ankit06/ml-model/predict.py";
const TRAIN_SCRIPT = "/home/ankit06/ml-model/train_model.py";
function signToken(username, role) {
  return jwt.sign({ username, role }, SECRET, { expiresIn: "6h" });
}
app.post("/api/signup", (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) return res.status(400).json({ error: "missing_fields" });
  try {
    const exists = findUser(username);
    if (exists) return res.status(400).json({ error: "user_exists" });
    const u = addUser(username, password, "user", email);
    const token = signToken(username, "user");
    return res.json({ token, username: u.username, role: "user" });
  } catch (err) { console.error("signup err:", err); return res.status(500).json({ error: "signup_failed" }); }
});
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const u = findUser(username);
  if (!u) return res.status(401).json({ error: "invalid_credentials" });
  const ok = bcrypt.compareSync(password, u.password_hash || u.passwordHash || "");
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });
  const token = signToken(u.username, u.role || "user");
  res.json({ token, username: u.username, role: u.role || "user" });
});
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "no_token" });
  try { const decoded = jwt.verify(token, SECRET); req.user = decoded; next(); } catch (err) { return res.status(401).json({ error: "invalid_token" }); }
}
app.get("/api/admin/users", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });
  const users = listUsers();
  res.json({ users });
});
app.get("/api/inventory", verifyToken, (req, res) => {
  const rows = db.prepare("SELECT * FROM inventory ORDER BY id DESC").all();
  res.json(rows);
});
app.post("/api/inventory", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });
  const { name, stock, category, status } = req.body;
  const info = db.prepare("INSERT INTO inventory (name,stock,category,status) VALUES (?,?,?,?)").run(name, stock || 0, category || "", status || "OK");
  res.json({ id: info.lastInsertRowid });
});
app.post("/api/benchmark/start", verifyToken, (req, res) => {
  const { durationSec = 10, intervalMs = 500 } = req.body;
  const iterations = Math.max(1, Math.floor((durationSec * 1000) / Math.max(100, intervalMs)));
  for (let i = 0; i < iterations; i++) {
    const latency = Math.round(Math.random() * 100);
    const syscalls = Math.round(Math.random() * 600);
    db.prepare("INSERT INTO benchmark_results (timestamp, latency_ms, syscalls) VALUES (?,?,?)")
      .run(new Date().toISOString(), latency, syscalls);
  }
  res.json({ message: "Benchmark simulated and stored" });
});
app.get("/api/benchmark/results", verifyToken, (req, res) => {
  const rows = db.prepare("SELECT * FROM benchmark_results ORDER BY id DESC LIMIT 500").all();
  res.json({ results: rows });
});
app.post("/api/metrics", (req, res) => {
  const { cpu=0, memory=0, syscall_rate=0, source="agent" } = req.body;
  db.prepare("INSERT INTO metrics (ts,cpu,memory,syscall_rate,source) VALUES (?,?,?,?,?)")
    .run(new Date().toISOString(), cpu, memory, syscall_rate, source);
  res.json({ ok: true });
});
app.get("/api/metrics/latest", (req, res) => {
  const row = db.prepare("SELECT * FROM metrics ORDER BY id DESC LIMIT 1").get();
  res.json(row || {});
});
app.post("/api/predict", verifyToken, (req, res) => {
  const body = req.body || {};
  const payload = JSON.stringify({
    pid: Number(body.pid || 0),
    tid: Number(body.tid || 0),
    syscall_id: Number(body.syscall_id || 0),
    latency_prev1: Number(body.latency_prev1 || 0),
    latency_prev2: Number(body.latency_prev2 || 0),
    delta_idx: Number(body.delta_idx || 1),
    inv_delta: Number(body.inv_delta || 1.0)
  });
  const py = spawn("python3.11", ["/home/ankit06/ml-model/predict.py", payload]);
  let out = "", errBuf = "";
  py.stdout.on("data", d => out += d.toString());
  py.stderr.on("data", d => errBuf += d.toString());
  py.on("close", code => {
    if (errBuf) console.error("PY ERR:", errBuf);
    try { const result = JSON.parse(out); res.json(result); } catch (e) { console.error("Predict parse failed:", e, "OUT:", out); res.status(500).json({ error: "predict_failed" }); }
  });
});
app.post("/api/admin/retrain", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });
  const trainCmd = `python3.11 /home/ankit06/ml-model/train_model.py --input /home/ankit06/syscall-traces/syscall_sample.csv --out /home/ankit06/ml-model/model_latency.pkl --anom /home/ankit06/ml-model/model_anomaly.pkl`;
  const sh = spawn("bash", ["-lc", trainCmd], { env: process.env });
  let out = "", err = "";
  sh.stdout.on("data", d => out += d.toString());
  sh.stderr.on("data", d => err += d.toString());
  sh.on("close", code => {
    if (code === 0) return res.json({ message: "retrain_done", out });
    else return res.status(500).json({ error: "retrain_failed", out, err });
  });
});
app.get("/api/health", (req, res) => res.json({ ok: true }));
// ---------- DASHBOARD ----------
app.get("/api/dashboard", verifyToken, (req, res) => {
  try {
    const invCount = db.prepare("SELECT COUNT(*) AS c FROM inventory").get().c;
    const userCount = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
    const lastMetric = db.prepare("SELECT * FROM metrics ORDER BY id DESC LIMIT 1").get() || {
      cpu: 0, memory: 0, syscall_rate: 0
    };

    const summary = {
      totalInventoryItems: invCount,
      totalUsers: userCount,
      latestMetrics: lastMetric
    };

    res.json(summary);
  } catch (e) {
    console.error("dashboard error:", e);
    res.status(500).json({ error: "dashboard_failed" });
  }
});
// ---------- SYSTEM STATS ----------
app.get("/api/system-stats", verifyToken, (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM metrics ORDER BY id DESC LIMIT 1").get();
    res.json(row || {
      ts: new Date().toISOString(),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      syscall_rate: Math.floor(Math.random() * 600)
    });
  } catch (err) {
    console.error("system-stats error:", err);
    res.status(500).json({ error: "system_stats_failed" });
  }
});
// ---------- OPTIMIZATION TIPS ----------
app.get("/api/optimization-tips", verifyToken, (req, res) => {
  const tips = [
    "Reduce high syscall rates by batching I/O operations.",
    "Optimize long-running syscalls and avoid unnecessary context switches.",
    "Monitor CPU-bound operations and distribute workloads efficiently.",
    "Enable caching to reduce repetitive system calls.",
    "Use asynchronous I/O to avoid blocking threads."
  ];
  res.json({ tips });
});
app.listen(5005, () => console.log(`Backend running on http://localhost:5005`));
