import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "./context/SnackbarContext";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AppRoutes />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
