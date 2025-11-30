import React, { useState } from "react";
import { Card, CardContent, CardHeader, Typography, Button, TextField } from "@mui/material";
import { getPrediction } from "../api";

export default function PredictCard() {
  const [form, setForm] = useState({
    pid: "", tid: "", syscall_id: "", latency_prev1: "", latency_prev2: "", delta_idx: "", inv_delta: ""
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError(""); setResult(null);
    const body = {
      pid: Number(form.pid || 0),
      tid: Number(form.tid || 0),
      syscall_id: Number(form.syscall_id || 0),
      latency_prev1: Number(form.latency_prev1 || 0),
      latency_prev2: Number(form.latency_prev2 || 0),
      delta_idx: Number(form.delta_idx || 1),
      inv_delta: Number(form.inv_delta || 1.0),
    };

    try {
      const res = await getPrediction(body);
      if (res.error) setError(res.error);
      else setResult(res);
    } catch (e) {
      setError(e.response?.data?.error || "Prediction failed");
    }
  };

  return (
    <Card>
      <CardHeader title="AI Latency Prediction" />
      <CardContent>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <TextField name="pid" label="PID" value={form.pid} onChange={handleChange} />
          <TextField name="tid" label="TID" value={form.tid} onChange={handleChange} />
          <TextField name="syscall_id" label="Syscall ID" value={form.syscall_id} onChange={handleChange} />
          <TextField name="latency_prev1" label="Latency Prev1" value={form.latency_prev1} onChange={handleChange} />
          <TextField name="latency_prev2" label="Latency Prev2" value={form.latency_prev2} onChange={handleChange} />
          <TextField name="delta_idx" label="Delta idx" value={form.delta_idx} onChange={handleChange} />
          <TextField name="inv_delta" label="Inv delta" value={form.inv_delta} onChange={handleChange} />
        </div>

        <Button variant="contained" sx={{ mt: 2 }} onClick={submit}>Predict</Button>

        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

        {result && (
          <div style={{ marginTop: 12, background: "#e6f7ff", padding: 12, borderRadius: 6 }}>
            <Typography><b>Latency (μs):</b> {result.predicted_latency_us}</Typography>
            <Typography><b>Anomaly score:</b> {result.anomaly_score}</Typography>
            <Typography><b>Anomalous:</b> {result.is_anomalous ? "Yes" : "No"}</Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
