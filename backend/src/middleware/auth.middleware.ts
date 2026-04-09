import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { verifyAuthToken } from "../utils/token";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = authorization.slice("Bearer ".length).trim();
  const payload = verifyAuthToken(token);

  if (!payload) {
    return next(new AppError("Invalid or expired authentication token", 401));
  }

  req.user = {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  };

  return next();
};
