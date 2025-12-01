import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function AlertsChart({ alerts }) {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Alerts Trend
        </Typography>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={alerts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#2196f3" dot />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
