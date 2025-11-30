// frontend/src/components/InventoryBar.js
import React from "react";
import { Card, CardContent, Typography, Box, Chip, Grid } from "@mui/material";

/*
  InventoryBar - simple responsive list of inventory items
  Defensive: handles undefined / empty data
*/

export default function InventoryBar({ data = [] }) {
  const items = Array.isArray(data) ? data : [];

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Inventory
        </Typography>

        <Grid container spacing={1}>
          {items.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary">No inventory data</Typography>
            </Grid>
          )}

          {items.map((it) => (
            <Grid item xs={12} sm={6} md={4} key={it.id || `${it.name}-${Math.random()}`}>
              <Box sx={{ p: 1, borderRadius: 1, border: "1px solid #eee" }}>
                <Typography sx={{ fontWeight: 700 }}>{it.name || "Unnamed"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {typeof it.stock === "number" ? it.stock : "—"}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label={it.status || "UNKNOWN"} size="small" color={it.status === "LOW" ? "error" : "default"} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
