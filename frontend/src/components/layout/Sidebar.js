import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const items = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "System Stats", icon: <BarChartIcon />, path: "/system-stats" },
    { text: "Inventory", icon: <StorageIcon />, path: "/inventory" }
  ];

  return (
    <Drawer variant="permanent" sx={{ width: 240 }}>
      <List sx={{ mt: 10 }}>
        {items.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.text}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
