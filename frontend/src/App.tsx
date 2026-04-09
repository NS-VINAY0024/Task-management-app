import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SnackbarProvider>
          <AppRoutes />
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
