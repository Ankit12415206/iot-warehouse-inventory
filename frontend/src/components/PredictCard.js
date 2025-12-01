import React, { useState } from "react";
import { Card, CardContent, Grid, TextField, Button, Typography } from "@mui/material";
import { getPrediction } from "../api";

export default function PredictCard() {
  const [form, setForm] = useState({
    pid: "",
    tid: "",
    syscall_id: "",
    latency_prev1: "",
    latency_prev2: "",
    delta_idx: "",
    inv_delta: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    try {
      const res = await getPrediction(form);
      setResult(res);
    } catch (e) {
      console.error(e);
      alert("Prediction failed");
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          AI Latency Prediction
        </Typography>

        <Grid container spacing={2}>
          {Object.keys(form).map((key) => (
            <Grid item xs={12} md={6} key={key}>
              <TextField
                fullWidth
                label={key.replace("_", " ")}
                name={key}
                value={form[key]}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handlePredict}
        >
          Predict
        </Button>

        {result && (
          <Card sx={{ mt: 3, p: 2, background: "#eef" }}>
            <Typography><b>Predicted Latency:</b> {result.predicted_latency_us}</Typography>
            <Typography><b>Anomaly Score:</b> {result.anomaly_score}</Typography>
            <Typography><b>Is Anomalous:</b> {String(result.is_anomalous)}</Typography>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
