import { useEffect, useState, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import {
  getTaskById,
  updateTask,
  getApiErrorMessage,
} from "../services/taskService";
import { validateTaskForm, hasErrors } from "../utils/taskValidation";
import { toDateInputValue } from "../utils/formatDate";
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

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<TaskFormValues>(DEFAULT_FORM);
  const [fieldErrors, setFieldErrors] = useState<TaskFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ─── Load existing task ───────────────────────────────────────────────────
  useEffect(() => {
    if (!id) {
      setApiError("Task ID is missing.");
      setLoading(false);
      return;
    }

    let cancelled = false; // prevent setState after unmount

    const fetchTask = async () => {
      setLoading(true);
      setApiError(null);

      try {
        const task = await getTaskById(id);
        if (!cancelled) {
          setFormData({
            title: task.title,
            description: task.description ?? "",
            status: task.status,
            priority: task.priority,
            dueDate: toDateInputValue(task.dueDate),
          });
        }
      } catch (err) {
        if (!cancelled) setApiError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchTask();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name as keyof TaskFormErrors]) return prev;
      const next = { ...prev };
      delete next[name as keyof TaskFormErrors];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!id) {
      setApiError("Task ID is missing.");
      return;
    }

    const errors = validateTaskForm(formData);
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      await updateTask(id, formData);
      showSnackbar("Task updated successfully!", "success");
      navigate(`/task/${id}`);
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [id, formData, navigate, showSnackbar]);

  const handleCancel = useCallback(
    () => navigate(id ? `/task/${id}` : "/"),
    [navigate, id],
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ maxWidth: 760, mx: "auto" }}>
        <Stack alignItems="center" mt={8} spacing={2}>
          <CircularProgress aria-label="Loading task" />
          <Typography color="text.secondary">Loading task…</Typography>
        </Stack>
      </Box>
    );
  }

  // If load failed and we have no data at all, show a standalone error.
  if (apiError && !formData.title) {
    return (
      <Box sx={{ maxWidth: 760, mx: "auto" }}>
        <Alert severity="error" sx={{ mt: 4 }}>
          {apiError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 760, mx: "auto" }}>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <Chip
          icon={<EditRoundedIcon />}
          label="Refine your plan"
          sx={{ alignSelf: "flex-start" }}
        />
        <Typography variant="h3" component="h1">
          Edit Task
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620 }}>
          Update the details so the task still reflects the work, urgency, and
          timeline you actually need.
        </Typography>
      </Stack>

      <TaskForm
        formData={formData}
        errors={fieldErrors}
        apiError={apiError}
        submitting={submitting}
        submitLabel="Update Task"
        onChange={handleChange}
        onSubmit={() => void handleSubmit()}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default EditTask;
