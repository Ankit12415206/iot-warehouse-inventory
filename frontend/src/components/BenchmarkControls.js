import React from "react";
import { Box, Button, Typography } from "@mui/material";

function BenchmarkControls({ onStart, onStop }) {
  return (
    <Box bgcolor="#fff" p={3} borderRadius={2} boxShadow={1}>
      <Typography variant="h6" mb={2}>System Benchmark</Typography>
      <Button variant="contained" color="primary" onClick={onStart} sx={{ mr: 2 }}>
        Start Benchmark
      </Button>
      <Button variant="contained" color="error" onClick={onStop}>
        Stop Benchmark
      </Button>
    </Box>
  );
}

export default BenchmarkControls;
