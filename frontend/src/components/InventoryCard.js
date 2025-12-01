import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function InventoryCard({ inventory }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Inventory</Typography>
        {inventory.length === 0 ? (
          <Typography>No items</Typography>
        ) : (
          inventory.map(i => (
            <Typography key={i.id}>{i.name} — {i.stock}</Typography>
          ))
        )}
      </CardContent>
    </Card>
  );
}
