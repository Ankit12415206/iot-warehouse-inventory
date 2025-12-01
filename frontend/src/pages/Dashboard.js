import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Grid, Card, CardContent, Typography } from "@mui/material";

import {
  getDashboardData,
  getSystemStats,
  getOptimizationTips,
  getInventory
} from "../api";

import PredictCard from "../components/PredictCard";
import AlertsChart from "../components/AlertsChart";
import SystemStatsCard from "../components/SystemStatsCard";
import InventoryCard from "../components/InventoryCard";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState(null);
  const [tips, setTips] = useState(null);
  const [inventory, setInventoryState] = useState([]);

  useEffect(() => {
    getDashboardData().then(setDashboard).catch(console.error);
    getSystemStats().then(setStats).catch(console.error);
    getOptimizationTips().then(setTips).catch(console.error);
    getInventory().then(setInventoryState).catch(console.error);
  }, []);

  return (
    <MainLayout>
      <Grid container spacing={3}>

        {/* Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Overview</Typography>
              {dashboard ? (
                <>
                  <Typography>Total Items: {dashboard.items}</Typography>
                  <Typography>Low Stock: {dashboard.low_stock}</Typography>
                  <Typography>Users: {dashboard.users}</Typography>
                </>
              ) : (
                <Typography>Loading...</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Stats */}
        <Grid item xs={12} md={4}>
          <SystemStatsCard stats={dashboard?.system || stats} />
        </Grid>

        {/* Optimization Tip */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Optimization Tip</Typography>
            <Typography sx={{ mt: 1 }}>
              {tips ? tips.tip : "Loading..."}
            </Typography>
          </Card>
        </Grid>

        {/* Inventory */}
        <Grid item xs={12}>
          <InventoryCard inventory={inventory} />
        </Grid>

        {/* Alerts */}
        <Grid item xs={12}>
          <AlertsChart alerts={dashboard?.alerts || []} />
        </Grid>

        {/* Prediction */}
        <Grid item xs={12}>
          <PredictCard />
        </Grid>

      </Grid>
    </MainLayout>
  );
}
