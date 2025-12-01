import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

import MainLayout from "../components/layout/MainLayout";
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
  const [dash, setDash] = useState(null);
  const [stats, setStats] = useState(null);
  const [tips, setTips] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => { getDashboardData().then(setDash); }, []);
  useEffect(() => { getSystemStats().then(setStats); }, []);
  useEffect(() => { getOptimizationTips().then(setTips); }, []);
  useEffect(() => { getInventory().then(setInventory); }, []);

  return (
    <MainLayout>
      <Grid container spacing={3}>
        {/* Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Overview</Typography>
              {dash ? (
                <>
                  <Typography>Items: {dash.items}</Typography>
                  <Typography>Users: {dash.users}</Typography>
                </>
              ) : <Typography>Loading...</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* System stats */}
        <Grid item xs={12} md={4}>
          <SystemStatsCard stats={stats} />
        </Grid>

        {/* Tips */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Optimization Tip</Typography>
              <Typography sx={{ mt: 1 }}>{tips?.tip ?? "Loading..."}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}><InventoryCard inventory={inventory} /></Grid>
        <Grid item xs={12}><AlertsChart alerts={dash?.alerts || []} /></Grid>
        <Grid item xs={12}><PredictCard /></Grid>
      </Grid>
    </MainLayout>
  );
}
