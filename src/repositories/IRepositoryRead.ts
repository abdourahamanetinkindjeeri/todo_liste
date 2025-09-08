export default interface IRepositoryRead<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
}
