import IRepositoryCreate from "./IRepositoryCreate.js";
import IRepositoryRead from "./IRepositoryRead.js";
export default interface IRepository<T>
  extends IRepositoryRead<T>,
    IRepositoryCreate<T> {
  delete(id: number): Promise<void>;
}
