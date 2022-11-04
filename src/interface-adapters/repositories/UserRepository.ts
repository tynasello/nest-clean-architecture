import { BaseMapper } from '@application/logic/BaseMapper';
import { User } from '@domain/aggregates/User';
import { DomainEventManager } from '@domain/events/DomainEventManager';
import { UserCreatedEvent } from '@domain/events/UserCreatedEvent';
import { IUserRepository } from '@domain/interfaces/IUserRepository';
import { DatabaseService } from '@interface-adapters/Database.sevice';
import { UserGateway } from '@interface-adapters/gateways/User.gateway';
import { Inject, Injectable } from '@nestjs/common';

type IdentifierProps = {
  id?: number;
  username?: string;
};

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('BaseMapper<User>') private readonly userMap: BaseMapper<User>,
    private readonly userGateway: UserGateway,
  ) {}

  public async exists({ id, username }: IdentifierProps): Promise<boolean> {
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

  public async getOneByIdentifier({
    id,
    username,
  }: IdentifierProps): Promise<User | null> {
    const collectedUser = await this.databaseService.findUnique('user', {
      id: id,
      username: username,
    });
    const user = this.userMap.toDomain(collectedUser);
    return user;
  }

  public async create(user: User): Promise<User> {
    // map user to persistance
    const rawUser = this.userMap.toPersistence(user);

    // save user using ORM
    const createdUser = await this.databaseService.create('user', rawUser);

    user = this.userMap.toDomain(createdUser);

    DomainEventManager.notifySubscribersOfDomainEvent(
      UserCreatedEvent.name,
      this.userGateway,
      user,
    );

    return user;
  }

  public async updateUser(username: string, newUserProps: any): Promise<User> {
    const updatedUser = await this.databaseService.update(
      'user',
      { username: username },
      newUserProps,
    );

    return this.userMap.toDomain(updatedUser);
  }
}
