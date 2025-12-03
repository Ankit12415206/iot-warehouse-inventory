import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function InventoryCard({ inventory = [] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Inventory</Typography>
        <List>
          {inventory.length ? inventory.map(it => (
            <ListItem key={it.id}>
              <ListItemText primary={`${it.name} — ${it.stock}`} secondary={it.category} />
            </ListItem>
          )) : <Typography variant="caption">No items</Typography>}
        </List>
      </CardContent>
    </Card>
  );
}
