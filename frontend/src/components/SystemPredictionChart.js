// frontend/src/components/SystemPredictionChart.js
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/*
  SystemPredictionChart
  - Accepts prop `predictionStream` (single latest prediction object)
  - Maintains an internal rolling buffer of the last N predictions
  - Lightweight Recharts line chart
*/

export default function SystemPredictionChart({ predictionStream }) {
  const [buffer, setBuffer] = useState([]);

  useEffect(() => {
    if (!predictionStream) return;
    const entry = {
      time: new Date().toLocaleTimeString(),
      latency: Number(predictionStream.predicted_latency_us || 0),
      score: Number(predictionStream.anomaly_score || 0),
      anomalous: !!predictionStream.is_anomalous,
    };
    setBuffer((b) => {
      const nb = b.concat(entry).slice(-50); // keep last 50
      return nb;
    });
  }, [predictionStream]);

  // Ensure data always an array
  const data = Array.isArray(buffer) ? buffer : [];

  return (
    <Card sx={{ mt: 2, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Prediction Timeline</Typography>
          <Typography variant="caption" color="text.secondary">
            last {data.length} samples
          </Typography>
        </Box>

        <Box sx={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="latency" stroke="#1976d2" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
