import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function SystemStatsCard({ stats }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">System Stats</Typography>
        {stats ? (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={4}><Typography>CPU</Typography><Typography><b>{Math.round(stats.cpu)}%</b></Typography></Grid>
            <Grid item xs={4}><Typography>Memory</Typography><Typography><b>{Math.round(stats.memory)}%</b></Typography></Grid>
            <Grid item xs={4}><Typography>Syscalls</Typography><Typography><b>{stats.syscalls}</b></Typography></Grid>
          </Grid>
        ) : <Typography sx={{ mt: 1 }}>Loading...</Typography>}
      </CardContent>
    </Card>
  );
}
