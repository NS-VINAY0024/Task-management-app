import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logoutUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const onCreatePage = location.pathname === "/create";
  const onTasksPage = location.pathname === "/";
  const onAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

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

          {!onAuthPage && (
            <Stack direction="row" spacing={1} alignItems="center">
              {isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    to="/"
                    color="inherit"
                    sx={{
                      px: 2,
                      backgroundColor: onTasksPage
                        ? "rgba(31,111,120,0.08)"
                        : "transparent",
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
                  <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                    {user?.name}
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => {
                      logoutUser();
                      showSnackbar("Logged out successfully.", "success");
                      navigate("/login");
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" color="inherit">
                    Login
                  </Button>
                  <Button component={Link} to="/register" variant="contained">
                    Create account
                  </Button>
                </>
              )}
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
