export interface IRepository<T> {
  exists(identifiers: any): Promise<boolean>;
  getAll(): Promise<T[]>;
  getOneByIdentifier(identifiers: any): Promise<T>;
  create(t: T): Promise<any>;
}
