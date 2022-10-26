import { BaseMapper } from '@application/logic/BaseMapper';
import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/interfaces/IUserRepository';
import { DatabaseService } from '@interface-adapters/Database.sevice';
import { Inject, Injectable } from '@nestjs/common';

interface ExistsProps {
  id?: number;
  username?: string;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('BaseMapper<User>') private readonly userMap: BaseMapper<User>,
  ) {}

  public async exists({ id, username }: ExistsProps): Promise<boolean> {
    const userExists = await this.databaseService.findUnique('user', {
      id,
      username,
    });
    return !!userExists === true;
  }

  public async getAll(): Promise<User[]> {
    const collectedUsers = await this.databaseService.findMany('user');
    const users = collectedUsers.map((user: any) =>
      this.userMap.toDomain(user),
    );

    return users;
  }

  public async getOneById(userId: string): Promise<User | null> {
    const collectedUser = await this.databaseService.findUnique('user', {
      id: userId,
    });
    const user = this.userMap.toDomain(collectedUser);
    return user;
  }

  public async create(user: User): Promise<User> {
    // map user to persistance
    const rawUser = this.userMap.toPersistence(user);

    // save user using ORM
    const createdUser = await this.databaseService.create('user', rawUser);

    return this.userMap.toDomain(createdUser);
  }
}
