import { z } from "zod";

const statusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
const optionalTrimmedString = z
  .string()
  .trim()
  .max(2000)
  .transform((value) => (value.length === 0 ? undefined : value))
  .optional();

// Create Task Schema
export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: optionalTrimmedString,
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  dueDate: z.string().datetime().optional(),
});

// Update Task Schema (partial)
export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

// Get Tasks Schema
export const getTasksSchema = z.object({
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  sortBy: z.enum(["createdAt", "dueDate"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

// Get Task By Id Schema
export const getTaskByIdSchema = z.object({ id: z.string().uuid("Invalid task id") });

// Delete Task Schema
export const deleteTaskSchema = z.object({ id: z.string().uuid("Invalid task id") });

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
