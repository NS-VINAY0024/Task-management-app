import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage, getTasks } from "../services/taskService";
import type { Task } from "../types/task";

import {
  Alert,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";

const getStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "TODO":
      return "default";
    case "IN_PROGRESS":
      return "warning";
    case "DONE":
      return "success";
    default:
      return "default";
  }
};

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "LOW":
      return "success";
    case "MEDIUM":
      return "warning";
    case "HIGH":
      return "error";
    default:
      return "default";
  }
};

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
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
      <Typography variant="h4" gutterBottom mt={3}>
        Task List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/create")}
        sx={{ mb: 2 }}
      >
        Create Task
      </Button>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack spacing={2}>
        {!tasks.length && !error ? (
          <Typography color="text.secondary">No tasks found.</Typography>
        ) : null}
        {tasks.map((task) => (
          <Card
            key={task.id}
            variant="outlined"
            onClick={() => navigate(`/task/${task.id}`)}
            sx={{ cursor: "pointer" }}
          >
            <CardContent>
              <Typography variant="h6">{task.title}</Typography>

              <Stack direction="row" spacing={2} mt={1}>
                <Chip label={task.status} color={getStatusColor(task.status)} />

                <Chip
                  label={task.priority}
                  color={getPriorityColor(task.priority)}
                />
              </Stack>

              <Typography variant="body2" mt={1}>
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default TaskList;
