import type { NextFunction, Request, Response } from "express";
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
import { AppError } from "../utils/appError";

// CREATE TASK
export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    const newTask = await createTaskService(validatedData);

    return res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    return next(error);
  }
};

// GET ALL TASKS (with filters)
export const getTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedQuery = getTasksSchema.parse(req.query);

    const tasks = await getTasksService(validatedQuery);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return next(error);
  }
};

// GET TASK BY ID
export const getTaskByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getTaskByIdSchema.parse(req.params);

    const task = await getTaskByIdService(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

// UPDATE TASK
export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getTaskByIdSchema.parse(req.params);
    const validatedData = updateTaskSchema.parse(req.body);

    const updatedTask = await updateTaskService(id, validatedData);

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE TASK
export const deleteTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = deleteTaskSchema.parse(req.params);

    await deleteTaskService(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};
