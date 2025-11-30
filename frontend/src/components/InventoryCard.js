import React from "react";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function InventoryCard({ inventory = [] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Inventory</Typography>

        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(inventory.length ? inventory : [
              { id: 1, name: "Item A", stock: 120, status: "OK" },
              { id: 2, name: "Item B", stock: 8, status: "LOW" }
            ]).map((it) => (
              <TableRow key={it.id || it.name}>
                <TableCell>{it.name}</TableCell>
                <TableCell>{it.stock}</TableCell>
                <TableCell>{it.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
