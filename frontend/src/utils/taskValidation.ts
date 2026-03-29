import type { TaskFormValues } from "../types/task";

export const validateTaskForm = (values: TaskFormValues): string | null => {
  if (!values.title.trim()) {
    return "Title is required";
  }

  if (values.title.trim().length > 200) {
    return "Title must be 200 characters or fewer";
  }

  if (values.description.trim().length > 2000) {
    return "Description must be 2000 characters or fewer";
  }

  return null;
};
