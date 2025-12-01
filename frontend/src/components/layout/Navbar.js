import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ background: "linear-gradient(90deg,#4facfe,#00f2fe)" }}>
      <Toolbar>
        <Typography variant="h6">System Call Optimization Dashboard</Typography>
      </Toolbar>
    </AppBar>
  );
}
