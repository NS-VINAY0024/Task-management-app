import express from "express";
import {
  createTaskController,
  getTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = express.Router();

router.use(requireAuth);
router.get("/", getTasksController);
router.get("/:id", getTaskByIdController);
router.post("/", createTaskController);
router.put("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;
