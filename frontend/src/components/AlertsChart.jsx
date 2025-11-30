// frontend/src/components/AlertsChart.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AlertsChart({ alerts }) {
  // Prevent crashes if alerts is undefined or null
  const safeAlerts = Array.isArray(alerts) ? alerts : [];

  return (
    <Box sx={{ p: 2, background: "#fff", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Alerts Over Time
      </Typography>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={safeAlerts}>
          <CartesianGrid stroke="#e0e0e0" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="alertCount"
            stroke="#3f51b5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
