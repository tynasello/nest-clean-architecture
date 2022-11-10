import { UpdateUserDto } from '@application/contracts/dtos/user/UpdateUser.dto';
import { BaseMapper } from '@application/logic/BaseMapper';
import { DatabaseService } from '@application/services/Database.sevice';
import { User } from '@domain/entities/User';
import {
  DomainEventEnum,
  DomainEventManager,
} from '@domain/events/DomainEventManager';
import { IUserRepository } from '@domain/interfaces/repositories/IUserRepository';
import { Inject, Injectable } from '@nestjs/common';

type IdentifierProps = {
  id?: number;
  username?: string;
};

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly domainEventManager: DomainEventManager,
    @Inject('BaseMapper<User>')
    private readonly userMap: BaseMapper<User>,
  ) {}

  public async exists({ username }: IdentifierProps): Promise<boolean> {
    const user = await this.databaseService.findOne('user', {
      username: username ? username : '',
    });
    return !!user === true;
  }

  public async getAll(): Promise<User[]> {
    const collectedUsers = await this.databaseService.findMany('user');
    const users = collectedUsers.map((user: any) =>
      this.userMap.persistanceToDomain(user),
    );
    return users;
  }

  public async getOneByIdentifier({
    username,
  }: IdentifierProps): Promise<User | null> {
    const collectedUser = await this.databaseService.findOne('user', {
      username: username ? username : '',
    });
    const user = this.userMap.persistanceToDomain(collectedUser);
    return user;
  }

  public async create(user: User): Promise<User> {
    const rawUser = this.userMap.domainToPersistence(user);
    const createdUser = await this.databaseService.create('user', rawUser);
    user = this.userMap.persistanceToDomain(createdUser);

    this.domainEventManager.fireDomainEvent(
      DomainEventEnum.USER_CREATED_EVENT,
      {
        user,
      },
    );

    return user;
  }

  public async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { username, ...newUserProps } = updateUserDto;
    const updatedUser = await this.databaseService.updateMany(
      'user',
      { username },
      newUserProps,
    );

    return this.userMap.persistanceToDomain(updatedUser);
  }
}
