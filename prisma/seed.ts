import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const tasks = Array.from({ length: 10 }, (_, i) => ({
    libelle: `Tâche ${i + 1}`,
    description: `Description de la tâche ${i + 1}`,
    estAcheve: false,
  }));
  await prisma.todo.createMany({ data: tasks });
  console.log("10 tâches ajoutées !");

  const passwordHash = await bcrypt.hash("admin123", 10);
  const users = [
    {
      nom: "Diop",
      prenom: "Awa",
      email: "awa@exemple.com",
      password: passwordHash,
      role: Role.PROPRIETAIRE,
    },
    {
      nom: "Ndiaye",
      prenom: "Moussa",
      email: "moussa.ndiaye@exemple.com",
      password: passwordHash,
      role: Role.PROPRIETAIRE,
    },
    {
      nom: "Sarr",
      prenom: "Fatou",
      email: "fatou.sarr@exemple.com",
      password: passwordHash,
      role: Role.PROPRIETAIRE,
    },
    {
      nom: "Ba",
      prenom: "Amadou",
      email: "amadou.ba@exemple.com",
      password: passwordHash,
      role: Role.PROPRIETAIRE,
    },
  ];
  await prisma.user.createMany({ data: users });
  console.log("4 utilisateurs admin ajoutés !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
