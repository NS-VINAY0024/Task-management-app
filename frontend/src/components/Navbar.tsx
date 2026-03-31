import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const onCreatePage = location.pathname === "/create";

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 76, gap: 2 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                color: "primary.contrastText",
                background: "linear-gradient(135deg, #1f6f78 0%, #d97757 100%)",
                boxShadow: "0 14px 24px rgba(31,111,120,0.22)",
              }}
            >
              <DashboardRoundedIcon fontSize="small" />
            </Box>
            <Stack spacing={0.1}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                Workspace
              </Typography>
              <Typography variant="h6" component="div">
                Task Manager
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{
                px: 2,
                backgroundColor:
                  location.pathname === "/" ? "rgba(31,111,120,0.08)" : "transparent",
              }}
            >
              Tasks
            </Button>
            <Button
              component={Link}
              to="/create"
              variant={onCreatePage ? "outlined" : "contained"}
              startIcon={<AddIcon />}
            >
              New Task
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
