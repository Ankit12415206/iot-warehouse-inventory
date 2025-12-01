import React, { useState } from "react";
import { loginUser } from "../api";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.token);
      nav("/dashboard");
    } catch (e) {
      alert("Invalid Credentials");
    }
  };

  return (
    <Card sx={{ width: 400, mx: "auto", mt: 10, p: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>

        <TextField label="Username" fullWidth sx={{ mb: 2 }}
          onChange={(e) => setForm({ ...form, username: e.target.value })} />

        <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <Button variant="contained" fullWidth onClick={handleLogin}>
          Login
        </Button>

        <Button fullWidth sx={{ mt: 2 }} onClick={() => nav("/signup")}>
          Create account
        </Button>
      </CardContent>
    </Card>
  );
}
