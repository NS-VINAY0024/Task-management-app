import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Container maxWidth="sm">
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthLayout;
