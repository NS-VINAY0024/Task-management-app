export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
};

export interface TaskFormValues {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
}

export interface TaskQueryParams {
    status?: TaskStatus;
    priority?: TaskPriority;
    sortBy?: "createdAt" | "dueDate";
    order?: "asc" | "desc";
}

export interface ApiErrorResponse {
    success: false;
    message?: string;
    errors?: Array<{ message?: string }>;
}
