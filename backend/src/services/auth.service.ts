import { prisma } from "../db/prisma";
import type { LoginInput, RegisterInput } from "../validations/auth.validation";
import { AppError } from "../utils/appError";
import { hashPassword, verifyPassword } from "../utils/password";
import { createAuthToken } from "../utils/token";

const toAuthResponse = (user: { id: string; email: string; name: string }) => ({
  token: createAuthToken(user),
  user,
});

export const registerUserService = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: input.email.toLowerCase(),
      passwordHash: hashPassword(input.password),
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return toAuthResponse(user);
};

export const loginUserService = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new AppError("Invalid email or password", 401);
  }

  return toAuthResponse({
    id: user.id,
    email: user.email,
    name: user.name,
  });
};
