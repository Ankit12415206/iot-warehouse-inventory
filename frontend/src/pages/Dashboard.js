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
  const [tip, setTip] = useState(null);
  const [inventory, setInventoryState] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // ---- Dashboard data ----
  useEffect(() => {
    (async () => {
      try {
        const d = await getDashboardData();
        setDashboard(d);

        // Generate dummy alerts until backend provides real ones
        setAlerts([1, 2, 1]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // ---- System Stats ----
  useEffect(() => {
    (async () => {
      try {
        const s = await getSystemStats();
        setStats(s);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // ---- Optimization Tip ----
  useEffect(() => {
    (async () => {
      try {
        const t = await getOptimizationTips();
        setTip(t);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // ---- Inventory ----
  useEffect(() => {
    (async () => {
      try {
        const iv = await getInventory();
        setInventoryState(iv);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <MainLayout>
      <Grid container spacing={3}>
        
        {/* ==== OVERVIEW ==== */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Overview</Typography>

              {dashboard ? (
                <>
                  <Typography>Total Items: {dashboard.totalInventoryItems}</Typography>
                  <Typography>Low Stock: 
                    {dashboard.lowStockCount ?? 0}
                  </Typography>
                </>
              ) : (
                <Typography>Loading...</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ==== SYSTEM STATS ==== */}
        <Grid item xs={12} md={4}>
          <SystemStatsCard stats={stats} />
        </Grid>

        {/* ==== OPTIMIZATION TIP ==== */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Optimization Tip</Typography>
            <Typography sx={{ mt: 1 }}>
              {tip ? tip : "Loading..."}
            </Typography>
          </Card>
        </Grid>

        {/* ==== INVENTORY TABLE ==== */}
        <Grid item xs={12}>
          <InventoryCard inventory={inventory} />
        </Grid>

        {/* ==== ALERT CHART ==== */}
        <Grid item xs={12}>
          <AlertsChart alerts={alerts} />
        </Grid>

        {/* ==== PREDICT CARD ==== */}
        <Grid item xs={12}>
          <PredictCard />
        </Grid>

      </Grid>
    </MainLayout>
  );
}
