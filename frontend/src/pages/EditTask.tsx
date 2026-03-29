import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
} from "@mui/material";

const API_URL = "http://localhost:5000/api/tasks";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  });

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    const res = await axios.get(`${API_URL}/${id}`);
    const task = res.data.data;

    setFormData({
      ...task,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      dueDate: formData.dueDate
        ? new Date(formData.dueDate).toISOString()
        : undefined,
    };

    await axios.put(`${API_URL}/updateTask/${id}`, payload);
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" mt={3} mb={2}>
        Edit Task
      </Typography>

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

        <Button variant="contained" onClick={handleSubmit}>
          Update Task
        </Button>
      </Stack>
    </Container>
  );
};

export default EditTask;
