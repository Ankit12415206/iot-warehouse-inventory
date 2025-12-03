# AI-Enhanced System Call Optimization

## Structure
- backend: Express + SQLite + ML proxy
- frontend: React + MUI
- ml-model: train/predict scripts (run in WSL)

## Run (quick)
1. Backend (WSL)
   - `cd /mnt/c/Users/ankit/iot-warehouse-inventory/backend`
   - `npm install`
   - `node init_db.js` (creates `data/app.db` and default admin user)
   - ensure ml models at `/home/ankit06/ml-model/model_latency.pkl` (or adjust server.js ML_PY)
   - `node server.js`

2. ML (WSL)
   - create venv and install libs: `python3.11 -m venv ml-env && source ml-env/bin/activate && pip install scikit-learn pandas joblib`
   - run training: `python3.11 train_model.py --input /home/ankit06/syscall-traces/syscall_sample.csv --out /home/ankit06/ml-model/model_latency.pkl --anom /home/ankit06/ml-model/model_anomaly.pkl`

3. Frontend (PowerShell)
   - `cd C:\Users\ankit\iot-warehouse-inventory\frontend`
   - `npm install`
   - `npm start`

## Default credentials
- username: `admin`
- password: `admin123`


# AI-Enhanced System Call Optimization Platform
Comprehensive Technical Documentation ->
________________________________________
## 1. Introduction
The AI-Enhanced System Call Optimization Platform is an end-to-end system designed to analyze system call behavior, predict latency, detect anomalies, and provide actionable optimization insights through a unified interface.
This project integrates:
•	Machine Learning (Python + scikit-learn)
•	Backend Computing (Node.js + Express + SQLite)
•	Frontend Visualization (React + Material UI + Recharts)
•	System Metrics Monitoring
•	Inventory & Benchmark Management
•	Authentication & Role-Based Access
The system is engineered to demonstrate how AI can optimize low-level system behavior, especially system call patterns, which are critical indicators of OS performance under load.
This README provides complete documentation, enough for:
✔ Industry-level understanding
✔ Academic submission
✔ Viva preparation
✔ Developer onboarding
✔ Long-term maintenance
________________________________________
## 2. System Architecture Overview
The platform follows a modular multi-tier architecture, where each layer communicates with others via defined interfaces.
### High-Level Architecture Diagram
 ┌──────────────────────────────┐
 │        FRONTEND (React)      │
 │ Dashboards · Charts · Forms  │
 └───────────────┬──────────────┘
                 │ Axios API Calls
                 ▼
 ┌──────────────────────────────┐
 │     BACKEND (Node + Express) │
 │ Routing · Auth · DB · ML API │
 └───────┬───────────┬──────────┘
         │           │
         │ SQLite DB │ Python ML Engine
         │           │
         ▼           ▼
 ┌─────────────┐   ┌────────────────────┐
 │ app.db       │   │ predict.py         │
 │ users, inv,  │   │ train_model.py     │
 │ metrics, etc │   │ .pkl ML models     │
 └──────────────┘   └────────────────────┘
________________________________________
## 3. Detailed Explanation of All System Parts
This section explains EVERY major part of the system in depth.
________________________________________
### A. BACKEND SYSTEM (Node.js + Express + SQLite)
The backend acts as the central controller of the whole system.
It integrates:
•	Route handling
•	User authentication
•	Database operations
•	ML engine communication
•	Inventory and benchmark logic
•	Data aggregation for dashboards

## How Backend Works ->
### server.js — The Core Application Controller
This is the main file responsible for:
•	Initializing Express server
•	Attaching middleware
o	express.json() for JSON parsing
o	cors() to allow frontend access
•	Connecting to database & user modules
•	Declaring ALL API routes
•	Launching the Python ML model for predictions
•	Managing authentication with JWT
It is effectively the brain of the backend layer.
________________________________________
### Authentication Module (users_sql.js)
This module implements:
•	User lookup in SQLite
•	User insertion during signup
•	Password hashing through bcrypt
•	Password update methods
This ensures that the platform uses secure hashing and follows industry-grade authentication standards.
________________________________________
### SQLite Database & Schema (schema.sql + db.js)
The system uses better-sqlite3, a fast, synchronous SQLite engine.
Tables created:
Table	Purpose
users	Stores credentials & roles
inventory	Stores item records
benchmark_results	Stores synthetic syscall benchmark data
metrics	Stores CPU, memory, syscall rates
The database enables:
•	Inventory listing
•	Dashboard metrics
•	Benchmark visualization
•	User management
________________________________________
### Machine Learning Integration (Python Subprocess)
The backend executes ML tasks via:
spawn("python3.11", ["ml-model/predict.py", JSON_payload])
It waits for output, parses JSON, and returns the prediction to the frontend.
This creates a clean interface between Node.js and Python.
________________________________________
### Backend API Endpoints (Explained)
Authentication APIs
POST /api/signup
POST /api/login
Handles new user creation and JWT generation.
Inventory APIs
GET /api/inventory
POST /api/inventory   (admin only)
Dashboard APIs
GET /api/dashboard
Fetches composite data:
•	total items
•	total users
•	latest system metrics
Prediction API
POST /api/predict
Benchmark APIs
POST /api/benchmark/start
GET /api/benchmark/results
System Stats APIs
GET /api/system-stats
Optimization Tips
GET /api/optimization-tips
________________________________________
## B. MACHINE LEARNING ENGINE (Python 3.11)
This is where the system’s AI intelligence resides.
The ML engine uses:
•	RandomForestRegressor → Predict syscall latency
•	IsolationForest → Detect anomalies
•	Joblib → Save and load models
•	NumPy + Pandas → Data preparation
It operates inside WSL Ubuntu.
________________________________________
## ML Workflow Explained
### Data Input
The ML model is trained on:
pid, tid, syscall_id, latency_us
From this raw data, we build engineered features such as:
•	Previous latencies
•	Frequency proxies
•	Inverse deltas
•	Event index differences
•	Syscall ID one-hots
### Training Phase (train_model.py)
This script:
•	Loads CSV
•	Performs normalization
•	Builds ~15 features
•	Splits into train/test
•	Trains RandomForest model
•	Trains IsolationForest for anomaly detection
•	Saves:
o	model_latency.pkl
o	model_anomaly.pkl
### Prediction Phase (predict.py)
Takes JSON input, computes features, loads models, and outputs:
predicted_latency_us
anomaly_score
is_anomalous
The script includes auto feature alignment, so predictions never break even if backend sends minimal input.
________________________________________
## C. FRONTEND (React + MUI + Axios)
The frontend provides:
•	Authentication interface
•	Dashboard visualization
•	Prediction interface
•	Real-time system metrics
•	Optimization tips UI
________________________________________
## Frontend Structure Explained
### Pages/Dashboard.js
Fetches and displays:
•	Overview
•	CPU, Memory, Syscall stats
•	Optimization tips
•	Inventory list
•	Alerts
•	PredictCard
### api.js
A centralized Axios wrapper:
•	Auto-adds JWT token
•	Handles 401 responses
•	Provides all API functions
Protects the system from unauthorized access.
### Components
SystemStatsCard.js
Shows:
•	CPU %
•	Memory %
•	Syscall rate
PredictCard.js
Takes user input → triggers ML API → shows predicted results.
InventoryCard.js
Displays inventory data from the DB.
AlertsChart.js
Shows system alerts or anomalies.
MainLayout.js
Top navigation and sidebar.
________________________________________
## 4. COMPLETE SETUP GUIDE (ALL PLATFORMS)
### WSL Ubuntu (Backend + ML Engine)
cd /mnt/c/Users/ankit/iot-warehouse-inventory/backend
npm install
node init_db.js
Setup ML environment
python3.11 -m venv ~/ml-env
source ~/ml-env/bin/activate
pip install numpy pandas joblib scikit-learn
Train ML Model
python3.11 train_model.py --input syscall_sample.csv --out model_latency.pkl --anom model_anomaly.pkl
Run Backend
node server.js
________________________________________
### Windows PowerShell (Frontend)
cd C:\Users\ankit\iot-warehouse-inventory\frontend
npm install
npm start
________________________________________
## 5. DETAILED PREDICTION PIPELINE
User Input (PredictCard)
      ↓
POST /api/predict
      ↓
Backend spawns Python script
      ↓
predict.py loads models
      ↓
ML computes latency & anomaly
      ↓
Backend returns JSON
      ↓
Frontend displays results
________________________________________
## 6. ERROR HANDLING SYSTEM (EXPLAINED)
401 – Unauthorized
Cause:
•	Missing token
•	Expired token
Frontend auto-removes token & redirects to login.
500 – Server Error
Cause:
•	Missing model files
•	ML crash
•	DB corruption
•	Python path issues
•	Incorrect feature vector
404 – Route Missing
Cause:
•	Wrong backend URL
•	Backend not running
•	Wrong API path
________________________________________
## 7. DEFAULT CREDENTIALS
username: admin
password: admin123
________________________________________
## 8. GITHUB REPO LINK
(Replace with your own)
https://github.com/ankit06/ai-system-call-optimizer
________________________________________
## 9. FUTURE IMPROVEMENTS
•	Integrate eBPF for real syscall tracing
•	Introduce long-term monitoring dashboards
•	Upgrade models using deep learning
•	Add role-based access control
•	Enhance inventory analytics
________________________________________
## 10. Conclusion
This project demonstrates:
•	Full-stack engineering ability
•	Machine Learning integration
•	System-level optimization
•	Database-backed architecture
•	Secure authentication
•	Modern UI-based visualization
The platform is fully modular, scalable, and ready for deployment or extension into a production-grade performance monitoring system.


## THANK YOU ##