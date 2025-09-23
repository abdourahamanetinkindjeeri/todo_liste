import { PrismaClient, User } from "@prisma/client";
import IRepository from "./IRepository.js";

export default class UserRepository implements IRepository<User> {
  private prisma: PrismaClient = new PrismaClient();

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findAllAsArray(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // async create(data: Omit<User, "id">): Promise<User> {
  //   if (!data.password) {
  //     throw new Error("Le champ password est requis");
  //   }
  //   // Le mot de passe est déjà hashé par le middleware
  //   return this.prisma.user.create({ data });
  // }

    async create(data: Omit<User, "id">): Promise<User> {
        if (!data.password) {
            throw new Error("Le champ password est requis");
        }

        try {
            return await this.prisma.user.create({ data });
        } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                throw new Error("Un utilisateur avec cet email existe déjà");
            }
            throw error; // on relance si ce n’est pas un doublon
        }
    }


    async update(id: number, data: Partial<Omit<User, "id">>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }
}
