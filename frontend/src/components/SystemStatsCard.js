import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function SystemStatsCard({ stats }) {
  if (!stats) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">System Stats</Typography>
          <Typography sx={{ mt: 1 }}>Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  const cpu = stats.cpu?.toFixed(1) ?? 0;
  const memory = stats.memory?.toFixed(1) ?? 0;
  const syscalls = stats.syscall_rate ?? 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">System Stats</Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <Typography>CPU</Typography>
            <Typography><b>{cpu}%</b></Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>Memory</Typography>
            <Typography><b>{memory}%</b></Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>Syscalls</Typography>
            <Typography><b>{syscalls}</b></Typography>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
}
