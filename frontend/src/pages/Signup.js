import React, { useState } from "react";
import { signupUser } from "../api";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", email: "" });

  const handleSignup = async () => {
    try {
      const res = await signupUser(form);
      localStorage.setItem("token", res.token);
      nav("/dashboard");
    } catch (e) {
      alert("Signup failed");
    }
  };

  return (
    <Card sx={{ width: 400, mx: "auto", mt: 10, p: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Sign Up</Typography>

        <TextField label="Username" fullWidth sx={{ mb: 2 }}
          onChange={(e) => setForm({ ...form, username: e.target.value })} />

        <TextField label="Email" fullWidth sx={{ mb: 2 }}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <Button variant="contained" fullWidth onClick={handleSignup}>
          Sign Up
        </Button>
      </CardContent>
    </Card>
  );
}
