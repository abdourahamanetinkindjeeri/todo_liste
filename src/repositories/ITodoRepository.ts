export interface ITodoRepository<Todo> {
  findNotCompleted(): Promise<Todo[]>;
  findByStatus(status: string): Promise<Todo[]>;
  changerStatus(id: number, status: string): Promise<Todo>;
  completeTodo(id: number): Promise<Todo>;
}

export type Status = "EN_ATTENTE" | "EN_COURS" | "TERMINEE";
