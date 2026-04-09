import { createHmac } from "crypto";
import { env } from "../config/env";

interface AuthTokenPayload {
  sub: string;
  email: string;
  name: string;
  exp: number;
}

const base64UrlEncode = (value: string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
};

const sign = (header: string, payload: string) =>
  createHmac("sha256", env.AUTH_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

export const createAuthToken = (payload: {
  id: string;
  email: string;
  name: string;
}) => {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(
    JSON.stringify({
      sub: payload.id,
      email: payload.email,
      name: payload.name,
      exp: Math.floor(Date.now() / 1000) + env.AUTH_TOKEN_TTL_SECONDS,
    }),
  );

  return `${header}.${body}.${sign(header, body)}`;
};

export const verifyAuthToken = (token: string): AuthTokenPayload | null => {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    return null;
  }

  if (sign(header, body) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as AuthTokenPayload;

    if (payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};
