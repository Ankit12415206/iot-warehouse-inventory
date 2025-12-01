#!/usr/bin/env python3
import sys, json
import numpy as np
from joblib import load
import os

BASE = os.path.dirname(__file__)

model_latency = load(os.path.join(BASE, "model_latency.pkl"))
model_anom = load(os.path.join(BASE, "model_anomaly.pkl"))

try:
    data = json.loads(sys.argv[1])
except:
    print(json.dumps({"error": "invalid_input"}))
    exit()

features = [
    data.get("pid", 0),
    data.get("tid", 0),
    data.get("syscall_id", 0),
    data.get("latency_prev1", 0),
    data.get("latency_prev2", 0),
    data.get("delta_idx", 1),
    data.get("inv_delta", 1.0)
]

pred = float(model_latency.predict([features])[0])
score = float(model_anom.decision_function([features])[0])
is_anom = score < -0.2

print(json.dumps({
    "predicted_latency_us": pred,
    "anomaly_score": score,
    "is_anomalous": is_anom
}))
