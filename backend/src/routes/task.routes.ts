import express from "express";
import {
  createTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller";

const router = express.Router();

router.post("/createTask", createTaskController);
router.get("/getAllTasks", getTasksController);
router.get("/getTaskById/:id", getTaskByIdController);
router.put("/updateTask/:id", updateTaskController);
router.delete("/deleteTask/:id", deleteTaskController);

export default router;
