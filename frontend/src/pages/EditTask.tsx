import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import type { TaskFormValues } from "../types/task";
import {
  getApiErrorMessage,
  getTaskById,
  updateTask,
} from "../services/taskService";
import { validateTaskForm } from "../utils/taskValidation";

import {
  Alert,
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TaskFormValues>({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Task id is missing");
      setLoading(false);
      return;
    }

    void fetchTask(id);
  }, [id]);

  const fetchTask = async (taskId: string) => {
    setLoading(true);
    setError(null);

    try {
      const task = await getTaskById(taskId);
      setFormData({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      });
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!id) {
      setError("Task id is missing");
      return;
    }

    const validationError = validateTaskForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateTask(id, formData);
      navigate(`/task/${id}`);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Stack alignItems="center" mt={5}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" mt={3} mb={2}>
        Edit Task
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={2}>
        <TextField
          name="title"
          value={formData.title}
          onChange={handleChange}
          label="Title"
        />
        <TextField
          name="description"
          value={formData.description}
          onChange={handleChange}
          label="Description"
        />

        <TextField
          select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <MenuItem value="TODO">TODO</MenuItem>
          <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
          <MenuItem value="DONE">DONE</MenuItem>
        </TextField>

        <TextField
          select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <MenuItem value="LOW">LOW</MenuItem>
          <MenuItem value="MEDIUM">MEDIUM</MenuItem>
          <MenuItem value="HIGH">HIGH</MenuItem>
        </TextField>

        <TextField
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Updating..." : "Update Task"}
        </Button>
      </Stack>
    </Container>
  );
};

export default EditTask;
