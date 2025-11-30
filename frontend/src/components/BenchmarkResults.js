import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function BenchmarkResults({ results, anomalies }) {
  return (
    <Box bgcolor="#fff" p={3} borderRadius={2} boxShadow={1} mt={4}>
      <Typography variant="h6" mb={2}>Benchmark Results</Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Latency (ms)</TableCell>
            <TableCell>Syscalls</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.timestamp}</TableCell>
              <TableCell>{r.latencyMs}</TableCell>
              <TableCell>{r.syscalls}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={3}>
        <Typography variant="h6" mb={1}>Anomalies</Typography>
        {anomalies.length === 0 ? (
          <Typography>No anomalies detected</Typography>
        ) : (
          anomalies.map((a, i) => (
            <Typography key={i} color="red">
              {a.timestamp} — latency {a.latencyMs} ms (z-score flagged)
            </Typography>
          ))
        )}
      </Box>
    </Box>
  );
}

export default BenchmarkResults;
