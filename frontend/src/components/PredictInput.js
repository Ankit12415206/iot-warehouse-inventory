// frontend/src/components/PredictInput.js
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
} from "@mui/material";

export default function PredictInput({ sampleInput, setSampleInput }) {
  const handleChange = (field, value) => {
    setSampleInput((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  return (
    <Card sx={{ minWidth: 260, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Prediction Input
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These values will be passed to the AI model.
        </Typography>

        {/* PID */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="PID"
            type="number"
            value={sampleInput.pid}
            onChange={(e) => handleChange("pid", e.target.value)}
          />
        </Box>

        {/* TID */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="TID"
            type="number"
            value={sampleInput.tid}
            onChange={(e) => handleChange("tid", e.target.value)}
          />
        </Box>

        {/* syscall_id */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Syscall ID"
            type="number"
            value={sampleInput.syscall_id}
            onChange={(e) => handleChange("syscall_id", e.target.value)}
          />
        </Box>

        {/* latency_prev1 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Latency Prev 1"
            type="number"
            value={sampleInput.latency_prev1}
            onChange={(e) => handleChange("latency_prev1", e.target.value)}
          />
        </Box>

        {/* latency_prev2 */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Latency Prev 2"
            type="number"
            value={sampleInput.latency_prev2}
            onChange={(e) => handleChange("latency_prev2", e.target.value)}
          />
        </Box>

        {/* delta_idx */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Delta Index"
            type="number"
            value={sampleInput.delta_idx}
            onChange={(e) => handleChange("delta_idx", e.target.value)}
          />
        </Box>

        {/* inv_delta */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Inverse Delta"
            type="number"
            value={sampleInput.inv_delta}
            onChange={(e) => handleChange("inv_delta", e.target.value)}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
