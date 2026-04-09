import { prisma } from "./db/prisma";
import { env } from "./config/env";
import { app } from "./app";

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});
