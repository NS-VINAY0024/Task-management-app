import axios from "axios";
import type {
  ApiErrorResponse,
  Task,
  TaskFormValues,
  TaskQueryParams,
} from "../types/task";

const api = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
});

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

const buildTaskPayload = (data: TaskFormValues) => ({
  title: data.title.trim(),
  description: data.description.trim() || undefined,
  status: data.status,
  priority: data.priority,
  dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
});

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.errors?.[0]?.message ??
      error.message
    );
  }

  return "Something went wrong. Please try again.";
};

export const getTasks = async (params?: TaskQueryParams) => {
  const response = await api.get<ApiSuccessResponse<Task[]>>("/getAllTasks", {
    params,
  });
  return response.data.data;
};

export const getTaskById = async (id: string) => {
  const response = await api.get<ApiSuccessResponse<Task>>(`/getTaskById/${id}`);
  return response.data.data;
};

export const createTask = async (data: TaskFormValues) => {
  const response = await api.post<ApiSuccessResponse<Task>>(
    "/createTask",
    buildTaskPayload(data),
  );
  return response.data.data;
};

export const updateTask = async (id: string, data: TaskFormValues) => {
  const response = await api.put<ApiSuccessResponse<Task>>(
    `/updateTask/${id}`,
    buildTaskPayload(data),
  );
  return response.data.data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/deleteTask/${id}`);
};
