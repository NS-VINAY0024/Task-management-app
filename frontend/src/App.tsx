import { SnackbarProvider } from "./context/SnackbarContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <SnackbarProvider>
      <AppRoutes />
    </SnackbarProvider>
  );
}

export default App;
