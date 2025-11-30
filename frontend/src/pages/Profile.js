import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

function Profile() {
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "viewer";

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 400, mx: "auto", p: 2 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              bgcolor: "#1976d2",
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h5">{username}</Typography>
          <Typography variant="body1" color="text.secondary">
            Role: {role}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Profile;
