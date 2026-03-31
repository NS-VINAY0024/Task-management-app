import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";

import { createTask, getApiErrorMessage } from "../services/taskService";
import { validateTaskForm, hasErrors } from "../utils/taskValidation";
import { useSnackbar } from "../context/SnackbarContext";
import TaskForm from "../components/TaskForm";
import type { TaskFormValues, TaskFormErrors } from "../types/task";

const DEFAULT_FORM: TaskFormValues = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
};

const CreateTask = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<TaskFormValues>(DEFAULT_FORM);
  const [fieldErrors, setFieldErrors] = useState<TaskFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the field's inline error as the user types (eager feedback).
    setFieldErrors((prev) => {
      if (!prev[name as keyof TaskFormErrors]) return prev;
      const next = { ...prev };
      delete next[name as keyof TaskFormErrors];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const errors = validateTaskForm(formData);
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      await createTask(formData);
      showSnackbar("Task created successfully!", "success");
      navigate("/");
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [formData, navigate, showSnackbar]);

  const handleCancel = useCallback(() => navigate("/"), [navigate]);

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={3}>
        <Typography variant="h4" component="h1">
          Create Task
        </Typography>
      </Box>

      <TaskForm
        formData={formData}
        errors={fieldErrors}
        apiError={apiError}
        submitting={submitting}
        submitLabel="Create Task"
        onChange={handleChange}
        onSubmit={() => void handleSubmit()}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default CreateTask;
