import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { UserService } from '@application/use-cases/User.service';
import { Message } from '@domain/entities/Message';
import { Id } from '@domain/value-objects/Id';
import { MessageContent } from '@domain/value-objects/message/MessageContent';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dtos/message/CreateMessage.dto';
import { MessageDto } from '../dtos/message/Message.dto';

@Injectable()
export class MessageMap implements BaseMapper<Message> {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async persistanceToDomain(raw: any): Promise<Message | null> {
    const { id, content, createdAt } = raw;

    const sender = await this.userService.getUserById(raw.senderId);
    const receiver = await this.userService.getUserById(raw.receiverId);

    const userOrError = Message.create({
      id: { value: id },
      content: { value: content },
      createdAt: new Date(createdAt),
      sender: sender.getValue(),
      receiver: receiver.getValue(),
    });

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public async dtoToDomain(
    dto: CreateMessageDto & { senderUsername: string },
  ): Promise<Result<Message>> {
    const idOrError = Id.create();
    const contentOrError = MessageContent.create(dto.content);
    const senderOrError = await this.userService.getUserByUsername(
      dto.senderUsername,
    );
    const receiverOrError = await this.userService.getUserByUsername(
      dto.receiverUsername,
    );

    const combinedPropsResult = Result.combineResults([
      idOrError,
      contentOrError,
      senderOrError,
      receiverOrError,
    ]);

    if (combinedPropsResult.isFailure) {
      return Result.fail(combinedPropsResult.getError());
    }

    const id = idOrError.getValue();
    const content = contentOrError.getValue();
    const createdAt = new Date();
    const sender = senderOrError.getValue();
    const receiver = receiverOrError.getValue();

    const messageOrError = Message.create({
      id,
      content,
      createdAt,
      sender,
      receiver,
    });

    if (messageOrError.isFailure) {
      Result.fail(messageOrError.getError());
    }

    const message = messageOrError.getValue();

    return Result.ok(message);
  }

  public domainToPersistence(message: Message): any {
    const { id, content, createdAt } = message.props;

    return {
      id: id.value,
      content: content.value,
      createdAt: createdAt,
    };
  }

  public domainToDTO(message: Message): MessageDto {
    const { id, content, createdAt, sender, receiver } = message.props;

    const userDto = MessageDto.create({
      id: id.value,
      content: content.value,
      createdAt: createdAt.toLocaleDateString(),
      senderUsername: sender.props.username.value,
      receiverUsername: receiver.props.username.value,
    });
    return userDto;
  }
}
