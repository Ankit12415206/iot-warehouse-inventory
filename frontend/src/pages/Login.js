import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Box } from "@mui/material";
import { loginUser } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const data = await loginUser({ username, password });
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        nav("/dashboard");
      } else {
        setErr("Login failed");
      }
    } catch (e) {
      setErr(e.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>Sign in</Typography>
          <form onSubmit={submit}>
            <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} />
            {err && <Typography color="error" sx={{ mb: 1 }}>{err}</Typography>}
            <Button type="submit" variant="contained" fullWidth>Login</Button>
          </form>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Don't have an account? <Link to="/signup">Sign up</Link></Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
