export interface IRepository<T> {
  create(t: T): Promise<any>;
}
