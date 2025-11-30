import React from "react";
import { AppBar, Toolbar, Typography, Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import StorageIcon from "@mui/icons-material/Storage";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

export default function MainLayout({ children }) {
  const nav = useNavigate();

  const menuItems = [
    { text: "Dashboard", onClick: () => nav("/dashboard"), icon: <DashboardIcon /> },
    { text: "System Stats", onClick: () => {}, icon: <BarChartIcon /> },
    { text: "Inventory", onClick: () => {}, icon: <StorageIcon /> },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ ml: `${drawerWidth}px`, background: "linear-gradient(90deg,#0093E9,#80D0C7)" }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            AI-Enhanced System Call Optimization Dashboard
          </Typography>
          <IconButton color="inherit" onClick={logout}><LogoutIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{
        width: drawerWidth, flexShrink: 0,
        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", background: "#0b1220", color: "#fff" }
      }}>
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 2 }}>
          <List>
            {menuItems.map((m) => (
              <ListItemButton key={m.text} onClick={m.onClick} sx={{ color: "#fff" }}>
                <ListItemIcon sx={{ color: "#00e6e6" }}>{m.icon}</ListItemIcon>
                <ListItemText primary={m.text} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
