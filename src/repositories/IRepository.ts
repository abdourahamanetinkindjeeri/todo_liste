import IRepositoryCreate from "./IRepositoryCreate";
import IRepositoryRead from "./IRepositoryRead";
export default interface IRepository<T>
  extends IRepositoryRead<T>,
    IRepositoryCreate<T> {
  delete(id: number): Promise<void>;
}
