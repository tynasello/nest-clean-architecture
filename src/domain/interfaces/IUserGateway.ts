import { User } from '@domain/entities/User';

export interface IUserGateway {
  emitUserCreated(event: string, user: User): void;
}
