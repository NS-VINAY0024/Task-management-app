import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const getTasks = async (params?: any) => {
  const response = await axios.get(`${API_URL}/getAllTasks`, { params });
  return response.data.data;
};

export const getTasksById = async (id: string) => {
  const response = await axios.get(`${API_URL}/getTaskById/${id}`);
  return response.data.data;
};

export const createTask = async (data: any) => {
  const response = await axios.post(`${API_URL}/createTask`, data);
  return response.data;
};
