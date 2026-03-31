import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppShell = () => {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 3, md: 5 },
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default AppShell;
