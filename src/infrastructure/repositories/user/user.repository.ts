import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../application/interfaces/user-repository.interface';
import { Result } from '../../../application/logic/result';
import { User } from '../../../domain/entities/user';
import { CUSTOM_ERRORS } from '../../../domain/errors/custom-errors';
import { PrismaService } from '../../services/prisma/prisma.service';
import { PersistedUser } from './persisted-user';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly _prismaService: PrismaService) {}

  public async createUser(
    user: Omit<User, 'id' | 'refreshToken'>,
  ): Promise<Result<User>> {
    const persistedUser = this.toPersistedUserEntity(user);
    try {
      const createdUser = this.toUserDomainEntity(
        await this._prismaService.user.create({
          data: persistedUser,
        }),
      );
      return Result.ok<User>(createdUser);
    } catch (e: any) {
      return Result.fail({
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: 'Failed to create a new user.',
      });
    }
  }

  public async getUserByUsername(username: string): Promise<Result<User>> {
    try {
      const persistedUser = await this._prismaService.user.findUnique({
        where: { username: username },
      });
      const user = this.toUserDomainEntity(persistedUser);
      return Result.ok<User>(user);
    } catch (e: any) {
      return Result.fail({
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: 'User does not exist.',
      });
    }
  }

  public async upsertRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<Result<User>> {
    try {
      const updatedUser = this.toUserDomainEntity(
        await this._prismaService.user.update({
          where: { username: username },
          data: { refreshToken: refreshToken },
        }),
      );
      return Result.ok<User>(updatedUser);
    } catch (e: any) {
      return Result.fail({
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: 'Failed to upsert refresh token.',
      });
    }
  }

  private toUserDomainEntity(persistedUser: PersistedUser): User {
    const user = new User({
      id: persistedUser.id,
      username: persistedUser.username,
      password: persistedUser.password,
      refreshToken: persistedUser.refreshToken,
    });
    return user;
  }

  private toPersistedUserEntity(
    user: Omit<User, 'id' | 'refreshToken'>,
  ): Omit<PersistedUser, 'id' | 'refreshToken'> {
    const persistedUser = new PersistedUser();
    persistedUser.username = user.username;
    persistedUser.password = user.password;
    return persistedUser;
  }
}
