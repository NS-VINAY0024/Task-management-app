import type { ApiSuccessResponse } from "../types/task";
import type {
  AuthResponse,
  AuthUser,
  LoginValues,
  RegisterValues,
} from "../types/auth";
import { apiClient } from "./apiClient";

export const register = async (payload: RegisterValues): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
    "/auth/register",
    payload,
  );

  return response.data.data;
};

export const login = async (payload: LoginValues): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
    "/auth/login",
    payload,
  );

  return response.data.data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await apiClient.get<ApiSuccessResponse<AuthUser>>("/auth/me");
  return response.data.data;
};
