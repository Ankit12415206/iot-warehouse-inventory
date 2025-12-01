import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function AlertsChart({ alerts }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Alerts</Typography>
        {alerts.length === 0 ? <Typography>No alerts</Typography> : alerts.map(a => (
          <Typography key={a.id}>{a.message}</Typography>
        ))}
      </CardContent>
    </Card>
  );
}
