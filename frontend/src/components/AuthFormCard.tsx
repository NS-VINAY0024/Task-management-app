import type { ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { AuthFormErrors, RegisterValues } from "../types/auth";

interface AuthFormCardProps {
  mode: "login" | "register";
  values: RegisterValues;
  errors: AuthFormErrors;
  apiError: string | null;
  submitting: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onSwitchMode: () => void;
}

const AuthFormCard = ({
  mode,
  values,
  errors,
  apiError,
  submitting,
  onChange,
  onSubmit,
  onSwitchMode,
}: AuthFormCardProps) => {
  const isRegister = mode === "register";

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {isRegister ? "Create your workspace account" : "Welcome back"}
              </Typography>
              <Typography color="text.secondary">
                {isRegister
                  ? "Sign up to save tasks privately and keep your workspace tied to your account."
                  : "Log in to view and manage your private task workspace."}
              </Typography>
            </Box>

            {apiError && <Alert severity="error">{apiError}</Alert>}

            {isRegister && (
              <TextField
                label="Name"
                name="name"
                value={values.name}
                onChange={onChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                fullWidth
              />
            )}

            <TextField
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={onChange}
              error={Boolean(errors.password)}
              helperText={
                errors.password ?? (isRegister ? "Minimum 8 characters" : " ")
              }
              fullWidth
            />

            <Button
              variant="contained"
              type="submit"
              disabled={submitting}
              startIcon={
                submitting ? <CircularProgress size={16} color="inherit" /> : null
              }
            >
              {submitting
                ? isRegister
                  ? "Creating account..."
                  : "Signing in..."
                : isRegister
                  ? "Create account"
                  : "Sign in"}
            </Button>

            <Button variant="text" onClick={onSwitchMode} disabled={submitting}>
              {isRegister
                ? "Already have an account? Sign in"
                : "Need an account? Create one"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AuthFormCard;
