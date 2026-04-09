export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues extends LoginValues {
  name: string;
}

export type AuthFormErrors = Partial<Record<keyof RegisterValues, string>>;
