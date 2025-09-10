import { User } from "@prisma/client";
import IRepository from "../repositories/IRepository.js";

import UserRepository from "../repositories/UserRepository.js";

export default class UserService implements IRepository<User> {
  private repository: UserRepository;
  constructor() {
    this.repository = new UserRepository();
  }
  async delete(id: number): Promise<void> {
    this.repository.delete(id);
  }
  async findAll(): Promise<User[]> {
    return this.repository.findAll();
  }
  async findById(id: number): Promise<User | null> {
    return this.repository.findById(id);
  }
  async create(data: Omit<User, "id">): Promise<User> {
    return this.repository.create(data);
  }
  async update(id: number, data: Partial<Omit<User, "id">>): Promise<User> {
    return this.repository.update(id, data);
  }
}
