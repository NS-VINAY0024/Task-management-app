import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_UNAUTHORIZED_EVENT } from "../constants/authEvents";
import { getCurrentUser, login, register } from "../services/authService";
import { clearAuthToken, getAuthToken, setAuthToken } from "../services/authStorage";
import type { AuthUser, LoginValues, RegisterValues } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginUser: (values: LoginValues) => Promise<void>;
  registerUser: (values: RegisterValues) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    const bootstrap = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        clearAuthToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthToken();
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const loginUser = useCallback(async (values: LoginValues) => {
    const result = await login(values);
    setAuthToken(result.token);
    setUser(result.user);
  }, []);

  const registerUser = useCallback(async (values: RegisterValues) => {
    const result = await register(values);
    setAuthToken(result.token);
    setUser(result.user);
  }, []);

  const logoutUser = useCallback(() => {
    clearAuthToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      loginUser,
      registerUser,
      logoutUser,
    }),
    [isLoading, loginUser, logoutUser, registerUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
