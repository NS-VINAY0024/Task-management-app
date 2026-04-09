import type { TaskFormValues, TaskFormErrors } from "../types/task";

export const validateTaskForm = (values: TaskFormValues): TaskFormErrors => {
  const errors: TaskFormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  } else if (values.title.trim().length > 200) {
    errors.title = "Title must be 200 characters or fewer.";
  }

  if (values.description.trim().length > 2000) {
    errors.description = "Description must be 2000 characters or fewer.";
  }

  if (values.dueDate) {
    const dueDate = new Date(`${values.dueDate}T00:00:00`);

    if (Number.isNaN(dueDate.getTime())) {
      errors.dueDate = "Enter a valid due date.";
    }
  }

  return errors;
};

export const hasErrors = (errors: TaskFormErrors): boolean =>
  Object.keys(errors).length > 0;
