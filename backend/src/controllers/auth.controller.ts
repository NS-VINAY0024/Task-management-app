import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { loginUserService, registerUserService } from "../services/auth.service";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { getRequestUser } from "../utils/request";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body);
  const result = await registerUserService(payload);

  return res.status(201).json({
    success: true,
    data: result,
    message: "Account created successfully",
  });
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);
  const result = await loginUserService(payload);

  return res.status(200).json({
    success: true,
    data: result,
    message: "Logged in successfully",
  });
});

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = getRequestUser(req);
    return res.status(200).json({
      success: true,
      data: user,
    });
  },
);
