import { useCallback, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthFormCard from "../components/AuthFormCard";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
import { getApiErrorMessage } from "../services/taskService";
import type { AuthFormErrors, RegisterValues } from "../types/auth";
import { hasAuthErrors, validateRegisterForm } from "../utils/authValidation";

const DEFAULT_VALUES: RegisterValues = {
  name: "",
  email: "",
  password: "",
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
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
    const nextErrors = validateRegisterForm(values);

    if (hasAuthErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      await registerUser(values);
      showSnackbar("Account created successfully.", "success");
      navigate("/", { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }, [navigate, registerUser, showSnackbar, values]);

  return (
    <AuthFormCard
      mode="register"
      values={values}
      errors={errors}
      apiError={apiError}
      submitting={submitting}
      onChange={handleChange}
      onSubmit={() => void handleSubmit()}
      onSwitchMode={() => navigate("/login")}
    />
  );
};

export default RegisterPage;
