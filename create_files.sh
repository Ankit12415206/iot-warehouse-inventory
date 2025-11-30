#!/usr/bin/env bash
set -e
ROOT="/mnt/c/Users/ankit/iot-warehouse-inventory"

echo "Creating files under $ROOT ..."

# Backend files
cat > "$ROOT/backend/package.json" <<'EOF'
{ "name":"iot-backend","version":"1.0.0","main":"server.js","scripts":{"start":"node server.js"},"dependencies":{"better-sqlite3":"^8.0.1","bcryptjs":"^2.4.3","cors":"^2.8.5","express":"^4.18.2","jsonwebtoken":"^9.0.0"}}
EOF

mkdir -p "$ROOT/backend/migrations"
cat > "$ROOT/backend/migrations/init.sql" <<'EOF'
-- init.sql
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', email TEXT );
CREATE TABLE IF NOT EXISTS inventory ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, stock INTEGER NOT NULL DEFAULT 0, category TEXT, status TEXT );
CREATE TABLE IF NOT EXISTS benchmark_results ( id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp TEXT NOT NULL, latency_ms REAL, syscalls INTEGER );
CREATE TABLE IF NOT EXISTS metrics ( id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, cpu REAL, memory REAL, syscall_rate INTEGER, source TEXT );
COMMIT;
EOF

cat > "$ROOT/backend/db.js" <<'EOF'
const path = require("path");
const Database = require("better-sqlite3");
const fs = require("fs");
const DB_PATH = path.join(__dirname, "data", "app.db");
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
module.exports = db;
EOF

cat > "$ROOT/backend/users_sql.js" <<'EOF'
const db = require("./db");
const bcrypt = require("bcryptjs");
function findUser(username) {
  const row = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  return row;
}
function addUser(username, password, role = "user", email = null) {
  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare("INSERT INTO users (username,password_hash,role,email) VALUES(?,?,?,?)").run(username, hash, role, email);
  return { id: info.lastInsertRowid, username, role, email };
}
function updatePassword(username, newPassword) {
  const hash = bcrypt.hashSync(newPassword, 10);
  const info = db.prepare("UPDATE users SET password_hash = ? WHERE username = ?").run(hash, username);
  return info.changes > 0;
}
function listUsers() {
  return db.prepare("SELECT id,username,role,email FROM users ORDER BY id DESC").all();
}
module.exports = { findUser, addUser, updatePassword, listUsers };
EOF

cat > "$ROOT/backend/server.js" <<'EOF'
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
app.listen(5005, () => console.log(`Backend running on http://localhost:5005`));
EOF

# Make scripts dir
mkdir -p "$ROOT/backend/scripts"
cat > "$ROOT/backend/scripts/backup_db.sh" <<'EOF'
#!/usr/bin/env bash
TS=$(date +"%Y%m%d_%H%M")
mkdir -p "$(dirname "$0")/../backups"
cp "$(dirname "$0")/../data/app.db" "$(dirname "$0")/../backups/app.db.$TS"
echo "Backup saved"
EOF
chmod +x "$ROOT/backend/scripts/backup_db.sh"

echo "Backend files created. Run npm install in backend folder (WSL)."

# FRONTEND: write minimal set if not exists (but user already has frontend)
mkdir -p "$ROOT/frontend/src/components/layout"
mkdir -p "$ROOT/frontend/src/components"
mkdir -p "$ROOT/frontend/src/pages"
mkdir -p "$ROOT/frontend/src"

cat > "$ROOT/frontend/src/api.js" <<'EOF'
import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5005/api", timeout: 8000 });
API.interceptors.request.use((config) => { const token = localStorage.getItem("token"); if (token) config.headers.Authorization = token; return config; });
API.interceptors.response.use((res) => res, (err) => { if (err.response && err.response.status === 401) { localStorage.removeItem("token"); } return Promise.reject(err); });
export const signupUser = (body) => API.post("/signup", body).then(r => r.data);
export const loginUser = (body) => API.post("/login", body).then(r => r.data);
export const resetPassword = (body) => API.post("/reset-password", body).then(r => r.data);
export const getDashboardData = () => API.get("/dashboard").then(r => r.data);
export const getSystemStats = () => API.get("/system-stats").then(r => r.data);
export const getInventory = () => API.get("/inventory").then(r => r.data);
export const getOptimizationTips = () => API.get("/optimization-tips").then(r => r.data);
export const getPrediction = (body) => API.post("/predict", body).then(r => r.data);
export const startBenchmark = (body) => API.post("/benchmark/start", body).then(r => r.data);
export const stopBenchmark = () => API.post("/benchmark/stop").then(r => r.data);
export const getBenchmarkResults = () => API.get("/benchmark/results").then(r => r.data);
EOF

# Add other frontend files if needed (PredictCard, Dashboard, etc.) - skip here to avoid overwriting user's custom frontend
echo "Note: frontend base api.js created/updated. You already have many frontend files; replace them manually with the final versions you prefer."

echo "All done. Run the following in WSL:"
echo "1) cd $ROOT/backend"
echo "2) npm install"
echo "3) node -e \"const db=require('./db'); const fs=require('fs'); db.exec(fs.readFileSync('./migrations/init.sql','utf8')); console.log('DB init');\""
echo "4) node server.js"
echo ""
echo "Then run frontend (PowerShell):"
echo "cd $ROOT/frontend && npm install && npm start"
