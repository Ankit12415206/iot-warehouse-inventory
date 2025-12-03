import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Grid } from "@mui/material";
import { getPrediction } from "../api";

export default function PredictCard() {
  const [form, setForm] = useState({ pid:0, tid:0, syscall_id:0, latency_prev1:0, latency_prev2:0, delta_idx:1, inv_delta:1.0 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const handle = (k) => (e) => setForm({...form, [k]: Number(e.target.value)});
  const run = async () => {
    setLoading(true);
    try {
      const r = await getPrediction(form);
      setResult(r);
    } catch(e){ console.error(e); alert("Prediction failed"); }
    setLoading(false);
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Predict latency</Typography>
        <Grid container spacing={1} sx={{ mt:1 }}>
          <Grid item xs={6}><TextField label="PID" fullWidth onChange={handle("pid")} defaultValue={form.pid} /></Grid>
          <Grid item xs={6}><TextField label="TID" fullWidth onChange={handle("tid")} defaultValue={form.tid} /></Grid>
          <Grid item xs={6}><TextField label="Syscall ID" fullWidth onChange={handle("syscall_id")} defaultValue={form.syscall_id} /></Grid>
          <Grid item xs={6}><TextField label="Prev latency 1" fullWidth onChange={handle("latency_prev1")} defaultValue={form.latency_prev1} /></Grid>
          <Grid item xs={6}><TextField label="Prev latency 2" fullWidth onChange={handle("latency_prev2")} defaultValue={form.latency_prev2} /></Grid>
          <Grid item xs={6}><TextField label="Delta idx" fullWidth onChange={handle("delta_idx")} defaultValue={form.delta_idx} /></Grid>
          <Grid item xs={6}><TextField label="Inv delta" fullWidth onChange={handle("inv_delta")} defaultValue={form.inv_delta} /></Grid>
          <Grid item xs={12}><Button variant="contained" onClick={run} disabled={loading}>Run Prediction</Button></Grid>
        </Grid>

        {result && <div style={{ marginTop: 12 }}>
          <Typography>Latency (us): <b>{result.predicted_latency_us}</b></Typography>
          <Typography>Anomaly score: <b>{result.anomaly_score}</b></Typography>
          <Typography>Is anomalous: <b>{String(result.is_anomalous)}</b></Typography>
        </div>}
      </CardContent>
    </Card>
  );
}
