import { z } from "zod";

// Create Task Schema
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.string().datetime().optional(),
});

// Update Task Schema (partial)
export const updateTaskSchema = createTaskSchema.partial();

// Get Tasks Schema
export const getTasksSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  sortBy: z.enum(["createdAt", "dueDate"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

// Get Task By Id Schema
export const getTaskByIdSchema = z.object({ id: z.string() });

// Delete Task Schema
export const deleteTaskSchema = z.object({ id: z.string() });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type GetTasksInput = z.infer<typeof getTasksSchema>;
export type GetTaskByIdInput = z.infer<typeof getTaskByIdSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;

export default {
  createTaskSchema,
  updateTaskSchema,
  getTasksSchema,
  getTaskByIdSchema,
  deleteTaskSchema,
};
