import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from "recharts";
import axios from "axios";

export default function AnomalyWidget({ windowSize = 40, pollInterval = 2000 }) {
  const [data, setData] = useState([]);

  const fetch = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: token } : {};
      const res = await axios.get("http://localhost:5005/api/predict", { headers });
      const score = res.data?.anomaly_score ?? 0;
      setData((d) => {
        const next = [...d, { t: new Date().toLocaleTimeString(), score: Number(score) }];
        if (next.length > windowSize) next.shift();
        return next;
      });
    } catch (e) {
      // ignore for now
    }
  };

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, pollInterval);
    return () => clearInterval(id);
  }, [pollInterval]);

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">Anomaly Score (recent)</Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>Live anomaly trend</Typography>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="t" hide />
              <YAxis domain={[-2, 2]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="score" stroke={false} fill="#e3f2fd" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Typography variant="caption" color="text.secondary">
          Shows anomaly score returned by the model. Positive values may indicate unusual syscall patterns.
        </Typography>
      </CardContent>
    </Card>
  );
}
