import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Task } from "../types/task";
import axios from "axios";

import { Container, Typography, Button, Stack } from "@mui/material";
import { getTasksById } from "../services/taskService";

const API_URL = "http://localhost:5000/api/tasks";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasksById(id!);
      setTask(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/deleteTask/${id}`);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (!task) return <p>Loading...</p>;

  return (
    <Container>
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
          Delete
        </Button>
      </Stack>
    </Container>
  );
};

export default TaskDetail;
