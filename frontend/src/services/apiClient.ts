import axios from "axios";
import { AUTH_UNAUTHORIZED_EVENT } from "../constants/authEvents";
import { getAuthToken } from "./authStorage";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }

    return await Promise.reject(error);
  },
);
