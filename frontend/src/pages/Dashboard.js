import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { getDashboardData, getSystemStats, getOptimizationTips, getInventory } from "../api";

import PredictCard from "../components/PredictCard";
import AlertsChart from "../components/AlertsChart";
import SystemStatsCard from "../components/SystemStatsCard";
import InventoryCard from "../components/InventoryCard";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState(null);
  const [tips, setTips] = useState(null);
  const [inventory, setInventoryState] = useState([]);

  useEffect(() => { (async () => {
    try { const d = await getDashboardData(); setDashboard(d); } catch (e){ console.error(e); }
  })(); }, []);

  useEffect(() => { (async () => {
    try { const s = await getSystemStats(); setStats(s); } catch (e){ console.error(e); }
  })(); }, []);

  useEffect(() => { (async () => {
    try { const t = await getOptimizationTips(); setTips(t); } catch (e){ console.error(e); }
  })(); }, []);

  useEffect(() => { (async () => {
    try { const iv = await getInventory(); setInventoryState(iv); } catch (e){ console.error(e); }
  })(); }, []);

  return (
    <MainLayout>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Overview</Typography>
              {dashboard ? <>
                <Typography>Total Items: {dashboard.items}</Typography>
                <Typography>Low Stock: {dashboard.low_stock}</Typography>
              </> : <Typography>Loading...</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}><SystemStatsCard stats={stats} /></Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Optimization Tip</Typography>
            <Typography sx={{ mt: 1 }}>{tips ? tips.tip : "Loading..."}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12}><InventoryCard inventory={inventory} /></Grid>
        <Grid item xs={12}><AlertsChart alerts={dashboard?.alerts || []} /></Grid>
        <Grid item xs={12}><PredictCard /></Grid>
      </Grid>
    </MainLayout>
  );
}
