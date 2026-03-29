import { Request, Response } from "express";
import {
  getTaskByIdService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
  createTaskService,
} from "../services/task.service";

import {
  createTaskSchema,
  updateTaskSchema,
  getTasksSchema,
  getTaskByIdSchema,
  deleteTaskSchema,
} from "../validations/task.validation";

// CREATE TASK
export const createTaskController = async (req: Request, res: Response) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    const newTask = await createTaskService(validatedData);

    return res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error: any) {
    console.error(error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

// GET ALL TASKS (with filters)
export const getTasksController = async (req: Request, res: Response) => {
  try {
    const validatedQuery = getTasksSchema.parse(req.query);

    const tasks = await getTasksService(validatedQuery);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    console.error(error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

// GET TASK BY ID
export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = getTaskByIdSchema.parse(req.params);

    const task = await getTaskByIdService(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    console.error(error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

// UPDATE TASK
export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = getTaskByIdSchema.parse(req.params);
    const validatedData = updateTaskSchema.parse(req.body);

    const updatedTask = await updateTaskService(id, validatedData);

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    console.error(error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: error.errors,
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

// DELETE TASK
export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = deleteTaskSchema.parse(req.params);

    await deleteTaskService(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error(error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: error.errors,
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};
