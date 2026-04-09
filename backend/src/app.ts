import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import taskRoutes from "./routes/task.routes";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      environment: env.NODE_ENV,
    },
  });
});

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Task management API running",
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);
