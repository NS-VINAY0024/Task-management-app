const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("crypto");

const prisma = new PrismaClient();

const hashPassword = (password) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};

async function main() {
  const email = "demo@example.com";
  const password = "Demo@123";
  const passwordHash = hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Demo User",
      passwordHash,
    },
    create: {
      name: "Demo User",
      email,
      passwordHash,
    },
  });

  await prisma.task.deleteMany({
    where: { userId: user.id },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Learn Prisma",
        description: "Understand Prisma basics",
        status: "TODO",
        priority: "HIGH",
        userId: user.id,
      },
      {
        title: "Build API",
        description: "Create CRUD endpoints",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        userId: user.id,
      },
      {
        title: "Frontend UI",
        description: "Design React UI",
        status: "TODO",
        priority: "LOW",
        userId: user.id,
      },
      {
        title: "Testing",
        description: "Test APIs",
        status: "DONE",
        priority: "MEDIUM",
        userId: user.id,
      },
      {
        title: "Deployment",
        description: "Deploy project",
        status: "TODO",
        priority: "HIGH",
        userId: user.id,
      },
    ],
  });

  console.log(`Seed data inserted for ${email} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
