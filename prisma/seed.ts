import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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
  // Création des utilisateurs et récupération des IDs
  const createdUsers = [];
  for (const user of users) {
    const created = await prisma.user.create({ data: user });
    createdUsers.push(created);
  }
  console.log("4 utilisateurs admin ajoutés !");

  // Répartition des tâches (2 par utilisateur)
  let taskIndex = 1;
  for (const user of createdUsers) {
    for (let i = 0; i < 2; i++) {
      await prisma.todo.create({
        data: {
          libelle: `Tâche ${taskIndex}`,
          description: `Description de la tâche ${taskIndex}`,
          estAcheve: false,
          userId: user.id,
        },
      });
      taskIndex++;
    }
  }
  console.log("8 tâches ajoutées et associées aux utilisateurs !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
