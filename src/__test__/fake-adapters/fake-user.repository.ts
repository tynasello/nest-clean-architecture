import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../application/interfaces/user-repository.interface';
import { Result } from '../../application/logic/result';
import { User } from '../../domain/entities/user';
import { CUSTOM_ERRORS } from '../../domain/errors/custom-errors';
import { PersistedUser } from '../../infrastructure/repositories/user/persisted-user';

@Injectable()
export class FakeUserRepository implements IUserRepository {
  private persistedUsers: PersistedUser[] = [];

  public async createUser(
    user: Omit<User, 'id' | 'refreshToken'>,
  ): Promise<Result<User>> {
    if (
      this.persistedUsers.find(
        (existingUser: User) => existingUser.username == user.username,
      )
    ) {
      return Result.fail({
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: 'Failed to create a new user.',
      });
    }
    this.persistedUsers.push({
      ...this.toPersistedUserEntity(user),
      id: this.persistedUsers.length.toString(),
      refreshToken: this.persistedUsers.length.toString(),
    });
    const createdUser = this.toUserDomainEntity(
      this.persistedUsers[this.persistedUsers.length - 1],
    );
    return Result.ok<User>(createdUser);
  }

  public async getUserByUsername(username: string): Promise<Result<User>> {
    const persistedUser = this.persistedUsers.find(
      (persistedUser) => persistedUser.username == username,
    );
    if (!persistedUser)
      return Result.fail({
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: 'User does not exist.',
      });

    const user = this.toUserDomainEntity(persistedUser);
    return Result.ok<User>(user);
  }

  public async upsertRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<Result<User>> {
    const persistedUserIndex = this.persistedUsers.findIndex(
      (user) => user.username === username,
    );
    if (persistedUserIndex === -1)
      return Result.fail({
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: 'Failed to upsert refresh token.',
      });
    this.persistedUsers[persistedUserIndex] = {
      ...this.persistedUsers[persistedUserIndex],
      refreshToken: refreshToken,
    };
    return Result.ok<User>(this.persistedUsers[persistedUserIndex]);
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
