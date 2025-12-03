import React from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

export default function AlertsChart({ alerts = [] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Alerts</Typography>
        <List>
          {alerts.length ? alerts.map((a, idx) => <ListItem key={idx}><Typography>{a}</Typography></ListItem>) : <Typography>No alerts</Typography>}
        </List>
      </CardContent>
    </Card>
  );
}
