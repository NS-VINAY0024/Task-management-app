import type { Request } from "express";
import { AppError } from "./appError";

export const getRequestUser = (req: Request) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  return req.user;
};
