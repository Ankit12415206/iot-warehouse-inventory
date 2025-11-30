// frontend/src/components/ResourceUsageCard.js
import React from "react";
import { Card, CardContent, Typography, LinearProgress, Box } from "@mui/material";

export default function ResourceUsageCard({ stats = {} }) {
  // Defensive defaults
  const cpu = typeof stats.cpu === "number" ? stats.cpu : 0;
  const memory = typeof stats.memory === "number" ? stats.memory : 0;
  const syscalls = typeof stats.syscalls === "number" ? stats.syscalls : 0;

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          System Resources
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Typography variant="caption">CPU Usage</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ flex: 1, mr: 1 }}>
              <LinearProgress variant="determinate" value={Math.min(cpu, 100)} />
            </Box>
            <Typography variant="body2">{Math.round(cpu)}%</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="caption">Memory Usage</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ flex: 1, mr: 1 }}>
              <LinearProgress variant="determinate" value={Math.min(memory, 100)} />
            </Box>
            <Typography variant="body2">{Math.round(memory)}%</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography variant="caption">Syscall Rate (ops/s)</Typography>
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {syscalls}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
