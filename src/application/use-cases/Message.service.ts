import { CreateMessageRequestDto } from '@application/contracts/dtos/message/CreateMessage.request.dto';
import { MessageHistory } from '@application/contracts/dtos/message/MessageHistory';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { Message } from '@domain/entities/Message';
import { IMessageRepository } from '@domain/interfaces/repositories/IMessageRepository';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from './User.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly userService: UserService,
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('BaseMapper<Message>')
    private readonly messageMap: BaseMapper<Message>,
  ) {}

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  async createMessage(
    senderUsername: string,
    createMessageDto: CreateMessageRequestDto,
  ): Promise<Result<Message>> {
    const messageOrError = await this.messageMap.dtoToDomain({
      senderUsername,
      ...createMessageDto,
    });

    if (messageOrError.isFailure) {
      return Result.fail(messageOrError.getError());
    }

    const message = messageOrError.getValue();

    const createdMessage = await this.messageRepository.create(message);

    return Result.ok<Message>(createdMessage);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async getMessageHistoryWithContact(
    username: string,
    contactUsername: string,
  ): Promise<Result<MessageHistory>> {
    const contactUserOrError = await this.userService.getUserByUsername(
      contactUsername,
    );

    if (contactUserOrError.isFailure)
      return Result.fail(contactUserOrError.getError());

    const contactUser = contactUserOrError.getValue();
    const contactId = contactUser.props.id.value;

    const messageHistoryWithContact =
      await this.messageRepository.getMessageHistoryWithContact(
        username,
        contactId,
      );

    return Result.ok<MessageHistory>(messageHistoryWithContact);
  }
}
