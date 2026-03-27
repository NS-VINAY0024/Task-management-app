import { Request, Response } from "express";
import {
  getTaskByIdService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
  createTaskService,
} from "../services/task.service";

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const newTask = await createTaskService(data);

    return res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

export const getTasksController = async (req: Request, res: Response) => {
  try {
    const { status, priority, sortBy, order } = req.query;

    const tasks = await getTasksService({
      status: status as any,
      priority: priority as any,
      sortBy: sortBy as any,
      order: order as any,
    });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedTask = await updateTaskService(id, data);

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    console.error(error);

    // Prisma error: record not found
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

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteTaskService(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error(error);

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
