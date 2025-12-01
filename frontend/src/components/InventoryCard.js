import React from "react";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function InventoryCard({ inventory }) {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6">Inventory</Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No items</TableCell>
              </TableRow>
            ) : (
              inventory.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{i.stock}</TableCell>
                  <TableCell>{i.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
