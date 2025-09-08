import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tasks = Array.from({ length: 10 }, (_, i) => ({
    libelle: `Tâche ${i + 1}`,
    description: `Description de la tâche ${i + 1}`,
    estAcheve: false,
    // dateCreation et derniereModif sont gérés par Prisma
  }));
  await prisma.todo.createMany({ data: tasks });
  console.log("10 tâches ajoutées !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
