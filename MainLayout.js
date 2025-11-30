import React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";

function MainLayout({ children }) {
  return (
    <>
      <AppBar position="static"> 
        <Button
        color="inherit"
        sx={{ ml: "auto" }}
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </Button>
        <Toolbar>
          <Typography variant="h6">
            AI-Enhanced Warehouse Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ marginTop: "30px" }}>
        {children}
      </Container>
    </>
  );
}

export default MainLayout;
