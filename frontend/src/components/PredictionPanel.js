// frontend/src/components/PredictionPanel.js
import React, { useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import PredictCard from "./PredictCard";
import PredictInput from "./PredictInput";

export default function PredictionPanel() {
  const [sampleInput, setSampleInput] = useState({
    pid: 1000,
    tid: 1000,
    syscall_id: 5,
    latency_prev1: 50,
    latency_prev2: 60,
    delta_idx: 1,
    inv_delta: 1.0,
  });

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        AI Syscall Prediction Panel
      </Typography>

      <Grid container spacing={2}>
        {/* Prediction Input */}
        <Grid item xs={12} md={6} lg={4}>
          <PredictInput sampleInput={sampleInput} setSampleInput={setSampleInput} />
        </Grid>

        {/* Prediction Result Card */}
        <Grid item xs={12} md={6} lg={4}>
          <PredictCard sampleInput={sampleInput} />
        </Grid>
      </Grid>
    </Box>
  );
}
