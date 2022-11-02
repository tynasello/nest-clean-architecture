import { User } from '@domain/aggregates/User';

export interface IUserGateway {
  emitUserCreated(event: string, user: User): void;
}
