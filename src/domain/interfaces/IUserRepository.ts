import { User } from '@domain/aggregates/User';
import { IRepository } from '@domain/interfaces/IRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserRepository extends IRepository<User> {
  // add additional methods unique to user
  updateUser(username: string, newUserProps: any): Promise<any>;
}
