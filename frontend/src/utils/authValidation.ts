import type { AuthFormErrors, LoginValues, RegisterValues } from "../types/auth";

export const validateLoginForm = (values: LoginValues): AuthFormErrors => {
  const errors: AuthFormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
};

export const validateRegisterForm = (
  values: RegisterValues,
): AuthFormErrors => {
  const errors = validateLoginForm(values);

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (values.password && values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
};

export const hasAuthErrors = (errors: AuthFormErrors) =>
  Object.keys(errors).length > 0;
