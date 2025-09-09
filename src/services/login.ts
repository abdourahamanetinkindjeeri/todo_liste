import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
export const login = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) return null;

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erreur inconnue lors du login");
  }
};
