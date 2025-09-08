import { PrismaClient, type Todo } from "@prisma/client";
import IRepository from "./IRepository";
import { ITodoRepository, Status } from "./ITodoRepository";

export default class TodoRepository
  implements IRepository<Todo>, ITodoRepository<Todo>
{
  private prisma: PrismaClient = new PrismaClient();

  async delete(id: number): Promise<void> {
    await this.prisma.todo.delete({ where: { id } });
  }

  async findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  async findAllAsArray(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  async findById(id: number): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where: { id } });
  }

  async create(data: Omit<Todo, "id">): Promise<Todo> {
    return this.prisma.todo.create({ data });
  }

  async update(id: number, data: Partial<Omit<Todo, "id">>): Promise<Todo> {
    return this.prisma.todo.update({ where: { id }, data });
  }

  async findNotCompleted(): Promise<Todo[]> {
    return this.prisma.todo.findMany({ where: { estAcheve: false } });
  }

  async findByStatus(status: Status): Promise<Todo[]> {
    return this.prisma.todo.findMany({ where: { status } });
  }

  async changerStatus(id: number, status: Status): Promise<Todo> {
    if (status === "TERMINEE") {
      return this.prisma.todo.update({
        where: { id },
        data: { status, estAcheve: true },
      });
    }
    return this.prisma.todo.update({
      where: { id },
      data: { status, estAcheve: false },
    });
  }

  async completeTodo(id: number): Promise<Todo> {
    return this.prisma.todo.update({
      where: { id },
      data: { estAcheve: true },
    });
  }
}
