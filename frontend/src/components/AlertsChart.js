import React from "react";
import { Card, Typography } from "@mui/material";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const fallback = [
  { name: "t1", value: 1 },
  { name: "t2", value: 2 },
  { name: "t3", value: 1 },
];

export default function AlertsChart({ alerts = [] }) {
  const data = Array.isArray(alerts) && alerts.length
    ? alerts.map((a, i) => ({ name: `A${i+1}`, value: typeof a === "number" ? a : (a.length || 1) }))
    : fallback;

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Alerts Trend</Typography>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#0093E9" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
