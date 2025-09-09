import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskDelegationRepository {
  static async addDelegation(todoId: number, userId: number) {
    return prisma.taskDelegation.create({
      data: { todoId, userId },
    });
  }

  static async isDelegate(userId: number, todoId: number) {
    const delegation = await prisma.taskDelegation.findFirst({
      where: { userId, todoId },
    });
    return !!delegation;
  }

  static async removeDelegation(todoId: number, userId: number) {
    return prisma.taskDelegation.deleteMany({
      where: { todoId, userId },
    });
  }

  static async getDelegates(todoId: number) {
    return prisma.taskDelegation.findMany({
      where: { todoId },
      include: { user: true },
    });
  }
}
