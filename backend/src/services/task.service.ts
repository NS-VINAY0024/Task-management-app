import { PrismaClient, Priority } from "@prisma/client";
import type { Task } from "@prisma/client";
import type {
  CreateTaskInput,
  GetTasksInput,
  UpdateTaskInput,
} from "../validations/task.validation";

type TaskStatus = Task["status"];

const prisma = new PrismaClient();

interface GetTasksParams {
  status?: TaskStatus;
  priority?: Priority;
  sortBy?: "createdAt" | "dueDate";
  order?: "asc" | "desc";
}

export const createTaskService = async (data: CreateTaskInput) => {
  return await prisma.task.create({
    data,
  });
};

export const getTasksService = async (params: GetTasksInput | GetTasksParams) => {
  const { status, priority, sortBy = "createdAt", order = "desc" } = params;

  return await prisma.task.findMany({
    where: {
      ...(status && { status }),
      ...(priority && { priority }),
    },
    orderBy: {
      [sortBy]: order,
    },
  });
};

export const getTaskByIdService = async (id: string) => {
  return await prisma.task.findUnique({
    where: { id },
  });
};

export const updateTaskService = async (id: string, data: UpdateTaskInput) => {
  return await prisma.task.update({
    where: { id },
    data,
  });
};

export const deleteTaskService = async (id: string) => {
  return await prisma.task.delete({
    where: { id },
  });
};
