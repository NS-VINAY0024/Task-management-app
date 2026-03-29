import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Task } from "../types/task";

import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import {
  deleteTask,
  getApiErrorMessage,
  getTaskById,
} from "../services/taskService";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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
      const data = await getTaskById(taskId);
      setTask(data);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteTask(id);
      navigate("/");
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Stack alignItems="center" mt={5}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      {!task ? (
        <Typography mt={3}>Task not found.</Typography>
      ) : (
        <>
      <Typography variant="h4" mt={3}>
        {task.title}
      </Typography>

      <Typography>Status: {task.status}</Typography>
      <Typography>Priority: {task.priority}</Typography>
      <Typography>
        Due:{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
      </Typography>

      <Stack direction="row" spacing={2} mt={3}>
        <Button
          variant="contained"
          onClick={() => navigate(`/edit/${task.id}`)}
        >
          Edit
        </Button>

        <Button variant="outlined" color="error" onClick={handleDelete}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </Stack>
        </>
      )}
    </Container>
  );
};

export default TaskDetail;
