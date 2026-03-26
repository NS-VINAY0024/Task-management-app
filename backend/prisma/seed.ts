import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.createMany({
    data: [
      {
        title: "Learn Prisma",
        description: "Understand Prisma basics",
        status: "TODO",
        priority: "HIGH",
      },
      {
        title: "Build API",
        description: "Create CRUD endpoints",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
      },
      {
        title: "Frontend UI",
        description: "Design React UI",
        status: "TODO",
        priority: "LOW",
      },
      {
        title: "Testing",
        description: "Test APIs",
        status: "DONE",
        priority: "MEDIUM",
      },
      {
        title: "Deployment",
        description: "Deploy project",
        status: "TODO",
        priority: "HIGH",
      },
    ],
  });

  console.log("Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
