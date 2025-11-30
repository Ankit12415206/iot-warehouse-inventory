#!/usr/bin/env python3
import sys
import json
import numpy as np
from joblib import load

MODEL_LAT = "/home/ankit06/ml-model/model_latency.pkl"
MODEL_ANOM = "/home/ankit06/ml-model/model_anomaly.pkl"

# ---- CHANGE THIS: insert your 4 top syscall IDs here ----
TOP_SYSCALLS = [16, 3, 11, 4]   # <--- replace after running Step 1
# ---------------------------------------------------------

# Load models
try:
    model_latency = load(MODEL_LAT)
    model_anomaly = load(MODEL_ANOM)
except Exception as e:
    print(json.dumps({"error": f"model_load_failed: {e}"}))
    exit()

# Parse input JSON
try:
    raw = sys.argv[1]
    data = json.loads(raw)
except Exception:
    print(json.dumps({"error": "invalid_input"}))
    exit()

# Base 7 features
features = [
    data.get("syscall_id", 0),
    data.get("pid", 0),
    data.get("tid", 0),
    data.get("latency_prev1", 0),
    data.get("latency_prev2", 0),
    data.get("delta_idx", 0),
    data.get("inv_delta", 0)
]

# Add one-hot syscall features
for sid in TOP_SYSCALLS[:4]:
    features.append(1 if data.get("syscall_id") == sid else 0)

X = np.array([features], dtype=float)

# Predict latency
try:
    latency = float(model_latency.predict(X)[0])
    anomaly_score = float(model_anomaly.decision_function(X)[0])
except Exception as e:
    print(json.dumps({"error": f"predict_error: {e}"}))
    exit()

print(json.dumps({
    "predicted_latency_us": latency,
    "anomaly_score": anomaly_score,
    "is_anomalous": anomaly_score < -0.5
}))
