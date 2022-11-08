import { User } from '@domain/entities/User';
import {
  DomainEvent,
  DomainEventManager,
} from '@domain/events/DomainEventManager';
import { IUserRepository } from '@domain/interfaces/IUserRepository';
import { UserMap } from '@interface-adapters/dal/mappers/UserMap';
import { DatabaseService } from '@interface-adapters/services/Database.sevice';
import { Injectable } from '@nestjs/common';

type IdentifierProps = {
  id?: number;
  username?: string;
};

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly domainEventManager: DomainEventManager,
  ) {}

  public async exists({ id, username }: IdentifierProps): Promise<boolean> {
    const user = await this.databaseService.findUnique('user', {
      id,
      username,
    });
    return !!user === true;
  }

  public async getAll(): Promise<User[]> {
    const collectedUsers = await this.databaseService.findMany('user');
    const users = collectedUsers.map((user: any) =>
      UserMap.persistanceToDomain(user),
    );

    return users;
  }

  public async getOneByIdentifier({
    id,
    username,
  }: IdentifierProps): Promise<User | null> {
    const collectedUser = await this.databaseService.findUnique('user', {
      id: id,
      username: username,
    });
    const user = UserMap.persistanceToDomain(collectedUser);
    return user;
  }

  public async create(user: User): Promise<User> {
    // map user to persistance
    const rawUser = UserMap.toPersistence(user);

    // save user using ORM
    const createdUser = await this.databaseService.create('user', rawUser);

    user = UserMap.persistanceToDomain(createdUser);

    this.domainEventManager.fireDomainEvent(DomainEvent.USER_CREATED_EVENT, {
      user,
    });

    return user;
  }

  public async updateUser(username: string, newUserProps: any): Promise<User> {
    const updatedUser = await this.databaseService.update(
      'user',
      { username: username },
      newUserProps,
    );

    return UserMap.persistanceToDomain(updatedUser);
  }
}
