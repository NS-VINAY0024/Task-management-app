const AUTH_TOKEN_KEY = "task_manager_auth_token";

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string) => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};
