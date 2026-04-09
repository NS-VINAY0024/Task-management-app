import { z } from "zod";

const statusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
const sortBySchema = z.enum(["createdAt", "dueDate"]);
const orderSchema = z.enum(["asc", "desc"]);
const dueDateSchema = z.string().datetime();
const optionalTrimmedString = z
  .string()
  .trim()
  .max(2000)
  .transform((value) => (value.length === 0 ? undefined : value))
  .optional();
const clearableTrimmedString = z
  .string()
  .trim()
  .max(2000)
  .transform((value) => (value.length === 0 ? null : value))
  .nullable()
  .optional();

// Create Task Schema
export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: optionalTrimmedString,
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  dueDate: dueDateSchema.optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200).optional(),
    description: clearableTrimmedString,
    status: statusSchema.optional(),
    priority: prioritySchema.optional(),
    dueDate: dueDateSchema.nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

// Get Tasks Schema
export const getTasksSchema = z.object({
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  search: z.string().trim().min(1).max(200).optional(),
  sortBy: sortBySchema.optional(),
  order: orderSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
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
