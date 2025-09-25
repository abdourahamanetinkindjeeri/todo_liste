import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TodoHistoryRepository {
  static async getHistoryByUserId(userId: number) {
    return prisma.todoHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: { user: true },
    });
  }

  // Marquer toutes les notifications non lues comme lues pour un utilisateur
  static async markAllAsReadForUser(userId: number) {
    return prisma.todoHistory.updateMany({
      where: { userId, estLu: false },
      data: { estLu: true },
    });
  }

  static async log({
    todoId,
    userId,
    action,
    description,
  }: {
    todoId: number;
    userId: number;
    action: string;
    description?: string;
  }) {
    return prisma.todoHistory.create({
      data: {
        todoId,
        userId,
        action,
        description,
      },
    });
  }

  static async getHistoryByTodoId(todoId: number) {
    return prisma.todoHistory.findMany({
      where: { todoId },
      orderBy: { createdAt: "asc" },
      include: { user: true },
    });
  }
}
