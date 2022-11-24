import { MessageHistory } from '@application/contracts/dtos/message/MessageHistory';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Message } from '@domain/entities/Message';
import {
  DomainEventEnum,
  DomainEventManager,
} from '@domain/events/DomainEventManager';
import { IMessageRepository } from '@domain/interfaces/repositories/IMessageRepository';
import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly domainEventManager: DomainEventManager,
    @Inject('BaseMapper<Message>')
    private readonly messageMap: BaseMapper<Message>,
  ) {}

  public async create(message: Message): Promise<Message> {
    const rawMessage = this.messageMap.domainToPersistence(message);
    const { sender, receiver } = message?.props;
    const senderId = sender?.props?.id?.value;
    const receiverId = receiver?.props?.id?.value;

    const createdMessage = await this.prismaService.message.create({
      data: {
        ...rawMessage,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
      },
    });

    message = await this.messageMap.persistanceToDomain(createdMessage);

    this.domainEventManager.fireDomainEvent(
      DomainEventEnum.MESSAGE_CREATED_EVENT,
      {
        message,
      },
    );

    return message;
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async getMessageHistoryWithContact(
    username: string,
    contactId: string,
  ): Promise<MessageHistory> {
    const collectedUser = await this.prismaService.user.findUnique({
      where: { username },
      include: {
        sentMessages: { where: { receiverId: contactId } },
        receivedMessages: { where: { senderId: contactId } },
      },
    });

    const sentMessages = await Promise.all(
      collectedUser.sentMessages.map((message) =>
        this.messageMap.persistanceToDomain(message),
      ),
    );

    const receivedMessages = await Promise.all(
      collectedUser.receivedMessages.map((message) =>
        this.messageMap.persistanceToDomain(message),
      ),
    );

    return { sentMessages, receivedMessages };
  }
}
