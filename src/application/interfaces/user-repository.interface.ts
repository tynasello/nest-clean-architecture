import { Result } from 'src/application/logic/result';
import { User } from '../../domain/entities/user';

export interface IUserRepository {
  createUser(user: Omit<User, 'id' | 'refreshToken'>): Promise<Result<User>>;
  getUserByUsername(username: string): Promise<Result<User>>;
  upsertRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<Result<User>>;
}
