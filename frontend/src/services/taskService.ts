import axios from "axios";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginationMeta,
  Task,
  TaskFormValues,
  TaskQueryParams,
} from "../types/task";
import { apiClient } from "./apiClient";

const buildCreateTaskPayload = (
  data: TaskFormValues,
): Partial<TaskFormValues> & { dueDate?: string } => ({
  title: data.title.trim(),
  description: data.description.trim() || undefined,
  status: data.status,
  priority: data.priority,
  dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
});

const buildUpdateTaskPayload = (
  data: TaskFormValues,
): {
  title: string;
  description: string | null;
  status: TaskFormValues["status"];
  priority: TaskFormValues["priority"];
  dueDate: string | null;
} => ({
  title: data.title.trim(),
  description: data.description.trim() || null,
  status: data.status,
  priority: data.priority,
  dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
});

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

export interface TaskListResponse {
  data: Task[];
  meta: PaginationMeta;
}

export const getTasks = async (
  params?: TaskQueryParams,
): Promise<TaskListResponse> => {
  const response = await apiClient.get<ApiSuccessResponse<Task[]>>("/tasks", {
    params,
  });

  return {
    data: response.data.data,
    meta: response.data.meta ?? {
      total: response.data.data.length,
      page: 1,
      pageSize: response.data.data.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await apiClient.get<ApiSuccessResponse<Task>>(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (data: TaskFormValues): Promise<Task> => {
  const response = await apiClient.post<ApiSuccessResponse<Task>>(
    "/tasks",
    buildCreateTaskPayload(data),
  );

  return response.data.data;
};

export const updateTask = async (
  id: string,
  data: TaskFormValues,
): Promise<Task> => {
  const response = await apiClient.put<ApiSuccessResponse<Task>>(
    `/tasks/${id}`,
    buildUpdateTaskPayload(data),
  );

  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};
