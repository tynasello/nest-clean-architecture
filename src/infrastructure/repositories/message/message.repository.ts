import { Injectable } from '@nestjs/common';
import { IMessageRepository } from '../../../application/interfaces/message-repository.interface';
import { Result } from '../../../application/logic/result';
import { Message } from '../../../domain/entities/message';
import { CUSTOM_ERRORS } from '../../../domain/errors/custom-errors';
import { mergeSortedArray } from '../../common/helpers/mergeSortedArrays';
import { PrismaService } from '../../services/prisma/prisma.service';
import { PersistedMessage } from './persisted-message';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(private readonly _prismaService: PrismaService) {}

  public async createMessage(
    message: Omit<Message, 'id'>,
  ): Promise<Result<Message>> {
    const persistedMessage = this.toPersistedMessageEntity(message);
    try {
      const createdMessage = this.toMessageDomainEntity(
        (await this._prismaService.message.create({
          data: {
            ...(persistedMessage as any),
            sender: { connect: { username: message.senderUsername } },
            receiver: { connect: { username: message.receiverUsername } },
          },
        })) as any,
      );
      return Result.ok<Message>(createdMessage);
    } catch (e: any) {
      return Result.fail({
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: 'Failed to create a new message.',
      });
    }
  }

  public async getMessageHistoryWithUsername(
    username: string,
    otherUsername: string,
  ): Promise<Result<Message[]>> {
    try {
      const existingUser = await this._prismaService.user.findUnique({
        where: { username: username },
        include: {
          sentMessages: {
            where: { receiverUsername: otherUsername },
            orderBy: { createdAt: 'desc' },
          },
          receivedMessages: {
            where: { senderUsername: otherUsername },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      const messageHistoryWithUsername = mergeSortedArray(
        existingUser.sentMessages,
        existingUser.receivedMessages,
      );
      messageHistoryWithUsername.map((message) =>
        this.toMessageDomainEntity(message),
      );
      return Result.ok<Message[]>(messageHistoryWithUsername);
    } catch (e: any) {
      return Result.fail({
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        message: 'Failed to create a new message.',
      });
    }
  }

  private toMessageDomainEntity(persistedMessage: PersistedMessage): Message {
    const message = new Message({
      id: persistedMessage.id,
      content: persistedMessage.content,
      createdAt: persistedMessage.createdAt,
      senderUsername: persistedMessage.senderUsername,
      receiverUsername: persistedMessage.receiverUsername,
    });
    return message;
  }

  private toPersistedMessageEntity(
    message: Omit<Message, 'id'>,
  ): Omit<PersistedMessage, 'senderUsername' | 'recieverUsername'> {
    const persistedMessage = new PersistedMessage();
    persistedMessage.content = message.content;
    return persistedMessage;
  }
}
