import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, LinearProgress, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios";

export default function LatencyCard({ pollInterval = 2000 }) {
  const [loading, setLoading] = useState(false);
  const [pred, setPred] = useState(null);
  const [error, setError] = useState(null);
  const [lastAt, setLastAt] = useState(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: token } : {};
      const res = await axios.get("http://localhost:5005/api/predict", { headers });
      setPred(res.data);
      setLastAt(new Date());
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
    const id = setInterval(fetchPrediction, pollInterval);
    return () => clearInterval(id);
  }, [pollInterval]);

  const statusColor = (lat) => {
    if (lat == null) return "#9e9e9e";
    if (lat > 100) return "#d32f2f";
    if (lat > 30) return "#ff9800";
    return "#2e7d32";
  };

  return (
    <Card sx={{ minWidth: 280, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">AI Predicted Syscall Latency</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Realtime prediction</Typography>
          </Box>

          <Box display="flex" gap={1}>
            <IconButton size="small" onClick={fetchPrediction} disabled={loading}>
              <RefreshIcon />
            </IconButton>
            <IconButton size="small" title="Model & info">
              <InfoOutlinedIcon />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" alignItems="baseline" gap={2} mb={1}>
          <Typography variant="h3" sx={{ color: statusColor(pred?.predicted_latency_us) }}>
            {pred?.predicted_latency_us ? pred.predicted_latency_us.toFixed(2) : "--"}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">µs</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          Anomaly score: {pred?.anomaly_score != null ? pred.anomaly_score.toFixed(3) : "--"}
        </Typography>

        <Box mb={1}>
          <LinearProgress
            variant="determinate"
            value={Math.min(Math.max((pred?.predicted_latency_us || 0) / 200 * 100, 0), 100)}
            sx={{
              height: 8,
              borderRadius: 2,
              background: "#f5f5f5",
              "& .MuiLinearProgress-bar": {
                background: statusColor(pred?.predicted_latency_us),
              },
            }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary">
          {loading ? "Updating..." : error ? `Error: ${error}` : lastAt ? `Last updated: ${lastAt.toLocaleTimeString()}` : "Idle"}
        </Typography>
      </CardContent>
    </Card>
  );
}
