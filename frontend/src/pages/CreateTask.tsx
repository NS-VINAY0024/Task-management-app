import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import { createTask, getApiErrorMessage } from "../services/taskService";
import type { TaskFormValues } from "../types/task";
import { validateTaskForm } from "../utils/taskValidation";

import {
  Alert,
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
} from "@mui/material";

const CreateTask = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TaskFormValues>({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const validationError = validateTaskForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createTask(formData);
      navigate("/");
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" mt={3} mb={2}>
        Create Task
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          select
          label="Status"
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
          label="Priority"
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
          label="Due Date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Creating..." : "Create Task"}
        </Button>
      </Stack>
    </Container>
  );
};

export default CreateTask;
