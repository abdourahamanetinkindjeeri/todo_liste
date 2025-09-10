export default interface IRepositoryCreate<T> {
  create(data: Omit<T, "id" | "dateCreation" | "derniereModif">): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
}
