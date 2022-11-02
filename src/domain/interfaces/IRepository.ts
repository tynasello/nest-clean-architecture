export interface IRepository<T> {
  exists(identifier: any): Promise<boolean>;
  getAll(): Promise<T[]>;
  getOneById(id: string): Promise<T>;
  create(t: T): Promise<any>;
}
