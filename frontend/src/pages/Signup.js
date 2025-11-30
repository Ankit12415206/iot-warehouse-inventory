import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Box } from "@mui/material";
import { signupUser } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const data = await signupUser({ username, password });
      if (data && (data.token || data.message)) {
        // some backend returns token, some return message
        if (data.token) localStorage.setItem("token", data.token);
        nav("/dashboard");
      } else {
        setErr("Signup failed");
      }
    } catch (e) {
      setErr(e.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>Create account</Typography>
          <form onSubmit={submit}>
            <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} />
            {err && <Typography color="error" sx={{ mb: 1 }}>{err}</Typography>}
            <Button type="submit" variant="contained" fullWidth>Sign up</Button>
          </form>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Already have an account? <Link to="/login">Login</Link></Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
