import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box, Chip, Typography } from "@mui/material";
import { getInventory } from "../api";
import { motion } from "framer-motion";

const statusColor = (status) => {
  if (status === "LOW") return "error";
  return "success";
};

function InventoryTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getInventory().then((data) => setRows(data));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Item Name", width: 180 },
    { field: "stock", headerName: "Stock", width: 120 },
    { field: "category", headerName: "Category", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColor(params.value)}
          variant="filled"
          size="small"
        />
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Inventory Table
      </Typography>

      <Box sx={{ height: 380, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          components={{ Toolbar: GridToolbarQuickFilter }}
          sx={{
            background: "white",
            borderRadius: "12px",
            p: 1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        />
      </Box>
    </motion.div>
  );
}

export default InventoryTable;
