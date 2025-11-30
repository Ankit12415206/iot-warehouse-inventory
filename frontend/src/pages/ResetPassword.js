import React, { useState } from "react";
import { TextField, Button, Card, Typography, Box } from "@mui/material";
import { resetPassword } from "../api";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", newPassword: "" });
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const res = await resetPassword(form.username, form.newPassword);
    if (!res.error) setMsg("Password updated! Login again.");
  };

  return (
    <Box sx={{ display: "flex", mt: 12, justifyContent: "center" }}>
      <Card sx={{ width: 350, p: 3, borderRadius: 3 }}>
        <Typography variant="h5">Reset Password</Typography>

        <TextField
          label="Username"
          fullWidth
          sx={{ mt: 2 }}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <TextField
          label="New Password"
          type="password"
          fullWidth
          sx={{ mt: 2 }}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />

        {msg && <Typography color="green">{msg}</Typography>}

        <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={submit}>
          Update Password
        </Button>

        <Button fullWidth sx={{ mt: 1 }} onClick={() => nav("/login")}>
          Back to Login
        </Button>
      </Card>
    </Box>
  );
}

export default ResetPassword;
