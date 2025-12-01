import React, { useState } from "react";
import { Card, CardContent, Button, TextField, Typography } from "@mui/material";
import { getPrediction } from "../api";

export default function PredictCard() {
  const [res, setRes] = useState(null);

  async function predict() {
    const data = {
      pid: 100,
      tid: 100,
      syscall_id: 2,
      latency_prev1: 5,
      latency_prev2: 6,
      delta_idx: 1,
      inv_delta: 1.0
    };
    setRes(await getPrediction(data));
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">ML Prediction</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={predict}>Predict</Button>

        {res && (
          <Typography sx={{ mt: 2 }}>
            Latency: {res.predicted_latency_us.toFixed(3)} μs  
            <br />
            Anomaly: {String(res.is_anomalous)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
