import React from "react";
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Avatar
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import StorageIcon from "@mui/icons-material/Storage";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const drawerWidth = 240;
const menuItems = [
  { text: "Dashboard Overview", icon: <DashboardIcon /> },
  { text: "System Stats", icon: <BarChartIcon /> },
  { text: "Inventory", icon: <StorageIcon /> },
  { text: "AI Prediction", icon: <SmartToyIcon /> },
];

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" sx={{
        width: drawerWidth, flexShrink: 0,
        "& .MuiDrawer-paper": { width: drawerWidth, background: "#1a1a2e", color: "white", borderRight: "1px solid #0f3460" }
      }}>
        <Toolbar />
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1, bgcolor: "#00e6e6", color: "black", fontSize: "24px" }}>
            {localStorage.getItem("username")?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Typography>{localStorage.getItem("username") || "User"}</Typography>
          <Typography variant="caption" color="gray">{localStorage.getItem("role") || "viewer"}</Typography>
        </Box>
        <List sx={{ mt: 2 }}>
          {menuItems.map((item, index) => (
            <ListItemButton key={item.text} sx={{ py: 1.5, color: index===0? "#00e6e6":"#fff", background: index===0? "#16213e":"transparent", "&:hover":{background:"#0f3460"}, borderRadius:"8px", mx:1, mb:1 }}>
              <ListItemIcon sx={{ color:"#00e6e6" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f6fa", minHeight: "100vh", p: 3, ml:`${drawerWidth}px` }}>
        <AppBar position="fixed" sx={{ zIndex: (theme)=> theme.zIndex.drawer + 1, background: "linear-gradient(to right, #0093E9, #80D0C7)" }}>
          <Toolbar>
            <Typography variant="h6" noWrap>AI-Enhanced System Call Optimization Dashboard</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
