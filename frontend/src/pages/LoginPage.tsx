import { useCallback, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthFormCard from "../components/AuthFormCard";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
import type { AuthFormErrors, RegisterValues } from "../types/auth";
import { hasAuthErrors, validateLoginForm } from "../utils/authValidation";
import { getApiErrorMessage } from "../services/taskService";

const DEFAULT_VALUES: RegisterValues = {
  name: "",
  email: "",
  password: "",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [values, setValues] = useState<RegisterValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name as keyof AuthFormErrors]) return prev;
      const next = { ...prev };
      delete next[name as keyof AuthFormErrors];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const nextErrors = validateLoginForm(values);

    if (hasAuthErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      await loginUser({ email: values.email, password: values.password });
      showSnackbar("Logged in successfully.", "success");
      const destination = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;
      navigate(destination ?? "/", { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }, [location.state, loginUser, navigate, showSnackbar, values]);

  return (
    <AuthFormCard
      mode="login"
      values={values}
      errors={errors}
      apiError={apiError}
      submitting={submitting}
      onChange={handleChange}
      onSubmit={() => void handleSubmit()}
      onSwitchMode={() => navigate("/register")}
    />
  );
};

export default LoginPage;
