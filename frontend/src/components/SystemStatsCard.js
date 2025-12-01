import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function SystemStatsCard({ stats }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">System Stats</Typography>
        {stats ? (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={4}><b>CPU:</b> {stats.cpu}%</Grid>
            <Grid item xs={4}><b>Memory:</b> {stats.memory}%</Grid>
            <Grid item xs={4}><b>Syscalls:</b> {stats.syscalls}</Grid>
          </Grid>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </CardContent>
    </Card>
  );
}
