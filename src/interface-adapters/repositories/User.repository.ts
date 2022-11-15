import { UpdateUserRequestDto } from '@application/contracts/dtos/user/UpdateUser.request.dto';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Message } from '@domain/entities/Message';
import { User } from '@domain/entities/User';
import {
  DomainEventEnum,
  DomainEventManager,
} from '@domain/events/DomainEventManager';
import { IUserRepository } from '@domain/interfaces/repositories/IUserRepository';
import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { Inject, Injectable } from '@nestjs/common';

type IdentifierProps = {
  id?: string;
  username?: string;
};

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly domainEventManager: DomainEventManager,
    @Inject('BaseMapper<User>')
    private readonly userMap: BaseMapper<User>,
    @Inject('BaseMapper<Message>')
    private readonly messageMap: BaseMapper<Message>,
  ) {}

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async userExists({ id, username }: IdentifierProps): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id, username },
    });
    return !!user === true;
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async getAllUsers(): Promise<User[]> {
    const collectedUsers = await this.prismaService.user.findMany({});

    const users = await Promise.all(
      collectedUsers.map((user: any) => this.userMap.persistanceToDomain(user)),
    );

    return users;
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async getUserByIdentifier({
    id,
    username,
  }: IdentifierProps): Promise<User | null> {
    const identifierProps = id ? { id } : username ? { username } : { id: '' };

    const collectedUser = await this.prismaService.user.findUnique({
      where: identifierProps,
    });

    const user = this.userMap.persistanceToDomain(collectedUser);
    return user;
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async create(user: User): Promise<User> {
    const rawUser = this.userMap.domainToPersistence(user);
    const createdUser = await this.prismaService.user.create({ data: rawUser });
    user = await this.userMap.persistanceToDomain(createdUser);

    this.domainEventManager.fireDomainEvent(
      DomainEventEnum.USER_CREATED_EVENT,
      {
        user,
      },
    );

    return user;
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async updateUser(updateUserDto: UpdateUserRequestDto): Promise<User> {
    const { username, ...newUserProps } = updateUserDto;
    const updatedUser = await this.prismaService.user.update({
      where: { username },
      data: newUserProps,
    });

    return this.userMap.persistanceToDomain(updatedUser);
  }
}
