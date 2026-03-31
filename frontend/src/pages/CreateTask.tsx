import { useCallback, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip, Stack, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

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
    <Box sx={{ maxWidth: 760, mx: "auto" }}>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <Chip
          icon={<AutoAwesomeRoundedIcon />}
          label="New planning space"
          sx={{ alignSelf: "flex-start" }}
        />
        <Typography variant="h3" component="h1">
          Create Task
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620 }}>
          Capture the work clearly, set the right priority, and give it a timeline
          that keeps your workflow moving.
        </Typography>
      </Stack>

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
    </Box>
  );
};

export default CreateTask;
