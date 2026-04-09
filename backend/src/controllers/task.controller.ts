import type { Request, Response } from "express";
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
import { asyncHandler } from "../utils/asyncHandler";
import { getRequestUser } from "../utils/request";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = getRequestUser(req);
    const validatedData = createTaskSchema.parse(req.body);
    const newTask = await createTaskService(user.id, validatedData);

    return res.status(201).json({
      success: true,
      data: newTask,
      message: "Task created successfully",
    });
  },
);

export const getTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = getRequestUser(req);
    const validatedQuery = getTasksSchema.parse(req.query);
    const tasks = await getTasksService({
      ...validatedQuery,
      userId: user.id,
    });

    return res.status(200).json({
      success: true,
      data: tasks.items,
      meta: tasks.meta,
    });
  },
);

export const getTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = getRequestUser(req);
    const { id } = getTaskByIdSchema.parse(req.params);
    const task = await getTaskByIdService(user.id, id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  },
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = getRequestUser(req);
    const { id } = getTaskByIdSchema.parse(req.params);
    const validatedData = updateTaskSchema.parse(req.body);

    const updatedTask = await updateTaskService(user.id, id, validatedData);

    if (!updatedTask) {
      throw new AppError("Task not found", 404);
    }

    return res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  },
);

export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = getRequestUser(req);
    const { id } = deleteTaskSchema.parse(req.params);

    const deleted = await deleteTaskService(user.id, id);

    if (deleted.count === 0) {
      throw new AppError("Task not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  },
);
