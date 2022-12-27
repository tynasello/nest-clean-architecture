import { Result } from 'src/application/logic/result';
import { User } from '../../domain/entities/user';

export interface IUserRepository {
  createUser(user: User): Promise<Result<User>>;
  getUserByUsername(username: string): Promise<Result<User>>;
  upsertRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<Result<User>>;
}
