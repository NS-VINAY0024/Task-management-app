import { Prisma, Priority } from "@prisma/client";
import type { Task } from "@prisma/client";
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "../validations/task.validation";
import { prisma } from "../db/prisma";
import { buildPaginationMeta } from "../utils/pagination";

type TaskStatus = Task["status"];

interface GetTasksParams {
  userId: string;
  status?: TaskStatus;
  priority?: Priority;
  search?: string;
  sortBy?: "createdAt" | "dueDate";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

const toCreateTaskWriteInput = (data: CreateTaskInput) => ({
  ...data,
  dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
});

const toUpdateTaskWriteInput = (data: UpdateTaskInput) => ({
  ...data,
  description:
    data.description === undefined ? undefined : data.description,
  dueDate:
    data.dueDate === undefined
      ? undefined
      : data.dueDate === null
        ? null
        : new Date(data.dueDate),
});

export const createTaskService = async (userId: string, data: CreateTaskInput) => {
  return await prisma.task.create({
    data: {
      userId,
      ...toCreateTaskWriteInput(data),
    },
  });
};

export const getTasksService = async (params: GetTasksParams) => {
  const {
    userId,
    status,
    priority,
    search,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    pageSize = 10,
  } = params;

  const where: Prisma.TaskWhereInput = {
    userId,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy:
        sortBy === "dueDate"
          ? {
              dueDate: order,
            }
          : {
              [sortBy]: order,
            },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    items,
    meta: buildPaginationMeta(total, page, pageSize),
  };
};

export const getTaskByIdService = async (userId: string, id: string) => {
  return await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const updateTaskService = async (
  userId: string,
  id: string,
  data: UpdateTaskInput,
) => {
  const result = await prisma.task.updateMany({
    where: { id, userId },
    data: toUpdateTaskWriteInput(data),
  });

  if (result.count === 0) {
    return null;
  }

  return await prisma.task.findFirst({
    where: { id, userId },
  });
};

export const deleteTaskService = async (userId: string, id: string) => {
  return await prisma.task.deleteMany({
    where: {
      id,
      userId,
    },
  });
};
