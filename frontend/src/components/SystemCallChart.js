// frontend/src/components/SystemCallChart.js
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/*
  SystemCallChart - shows benchmark results (latency over time) and highlights anomalies.
  Expects: data = array of { timestamp, latencyMs, syscalls }, anomalies = array
*/

export default function SystemCallChart({ data = [], anomalies = [] }) {
  // Defensive
  const plotData = Array.isArray(data) ? data.map((d) => ({
    time: d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : "",
    latency: Number(d.latencyMs || 0),
    syscalls: Number(d.syscalls || 0)
  })) : [];

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Benchmark — Latency</Typography>
          <Typography variant="caption" color="text.secondary">
            points: {plotData.length}
          </Typography>
        </Box>

        <Box sx={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={plotData}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="latency" stroke="#ff6d00" fill="#ffecdf" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {Array.isArray(anomalies) && anomalies.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="error">
              Detected anomalies: {anomalies.length}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
