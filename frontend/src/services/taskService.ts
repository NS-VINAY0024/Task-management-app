import axios from "axios";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  Task,
  TaskFormValues,
  TaskQueryParams,
} from "../types/task";

// Single axios instance — base URL from env so it works in all environments.
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/tasks",
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strips empty/undefined values and normalises payload for create/update. */
const buildTaskPayload = (
  data: TaskFormValues,
): Partial<TaskFormValues> & { dueDate?: string } => ({
  title: data.title.trim(),
  description: data.description.trim() || undefined,
  status: data.status,
  priority: data.priority,
  dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
});

/** Extracts a human-readable message from any thrown error. */
export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.errors?.[0]?.message ??
      error.message
    );
  }
  return "Something went wrong. Please try again.";
};

// ─── API calls ────────────────────────────────────────────────────────────────

export const getTasks = async (params?: TaskQueryParams): Promise<Task[]> => {
  const response = await api.get<ApiSuccessResponse<Task[]>>("/", {
    params,
  });
  return response.data.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get<ApiSuccessResponse<Task>>(`/${id}`);
  return response.data.data;
};

export const createTask = async (data: TaskFormValues): Promise<Task> => {
  const response = await api.post<ApiSuccessResponse<Task>>(
    "/",
    buildTaskPayload(data),
  );
  return response.data.data;
};

export const updateTask = async (
  id: string,
  data: TaskFormValues,
): Promise<Task> => {
  const response = await api.put<ApiSuccessResponse<Task>>(
    `/${id}`,
    buildTaskPayload(data),
  );
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};
