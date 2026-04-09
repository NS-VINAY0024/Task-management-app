import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export const hashPassword = (password: string): string => {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derivedKey}`;
};

export const verifyPassword = (
  password: string,
  passwordHash: string,
): boolean => {
  const [salt, storedKey] = passwordHash.split(":");

  if (!salt || !storedKey) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(storedKey, "hex");

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedKey);
};
