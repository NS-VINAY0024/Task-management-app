export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export const SORT_BY_OPTIONS = ["createdAt", "dueDate"] as const;
export const ORDER_OPTIONS = ["asc", "desc"] as const;
export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskSortBy = (typeof SORT_BY_OPTIONS)[number];
export type TaskOrder = (typeof ORDER_OPTIONS)[number];

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export interface TaskQueryParams {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: TaskSortBy;
  order?: TaskOrder;
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  errors?: Array<{ message?: string }>;
}

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>;

export const TASK_STATUS_LABELS: Record<TaskStatus | "ALL", string> = {
  ALL: "All",
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority | "ALL", string> = {
  ALL: "All priorities",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};
