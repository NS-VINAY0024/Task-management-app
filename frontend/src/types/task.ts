// ─── Enums as const arrays for iteration (avoids hardcoding in JSX) ───────────
export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export const SORT_BY_OPTIONS = ["createdAt", "dueDate"] as const;
export const ORDER_OPTIONS = ["asc", "desc"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

// ─── Core domain type ─────────────────────────────────────────────────────────
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO string from API
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// ─── Form values (all fields present; dueDate empty string = no date) ─────────
export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // "YYYY-MM-DD" or ""
}

// ─── Query params for list endpoint ──────────────────────────────────────────
export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: (typeof SORT_BY_OPTIONS)[number];
  order?: (typeof ORDER_OPTIONS)[number];
}

// ─── API response shapes ──────────────────────────────────────────────────────
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  errors?: Array<{ message?: string }>;
}

// ─── Per-field validation errors ──────────────────────────────────────────────
export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>;
