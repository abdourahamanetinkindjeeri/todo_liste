import { Todo } from "@prisma/client";
import IRepository from "../repositories/IRepository.js";
import TodoRepository from "../repositories/TodoRepository.js";
import { Status } from "../repositories/ITodoRepository.js";
import { TodoHistoryRepository } from "../repositories/TodoHistoryRepository.js";

export default class TodoService implements IRepository<Todo> {
  private repository: TodoRepository;
  constructor() {
    this.repository = new TodoRepository();
  }
  async delete(id: number): Promise<void> {
    this.repository.delete(id);
  }
  async findAll(): Promise<Todo[]> {
    return this.repository.findAll();
  }
  async findById(id: number): Promise<Todo | null> {
    return this.repository.findById(id);
  }
  async create(
    data: Omit<Todo, "id" | "dateCreation" | "derniereModif">
  ): Promise<Todo> {
    return this.repository.create(data);
  }
  async update(id: number, data: Partial<Omit<Todo, "id">>): Promise<Todo> {
    return this.repository.update(id, data);
  }
  async findNotCompleted(): Promise<Todo[]> {
    return this.repository.findNotCompleted();
  }

  async findByStatus(status: Status): Promise<Todo[]> {
    return this.repository.findByStatus(status);
  }

  async changerStatus(id: number, status: Status): Promise<Todo> {
    return this.repository.changerStatus(id, status);
  }

  async completeTodo(id: number): Promise<Todo> {
    return this.repository.completeTodo(id);
  }
  // Marquer toutes les notifications non lues comme lues pour un utilisateur
  async markAllNotificationsAsReadForUser(userId: number) {
    return TodoHistoryRepository.markAllAsReadForUser(userId);
  }
}
