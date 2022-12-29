import { Message } from 'src/domain/entities/message';
import { CUSTOM_ERRORS } from 'src/domain/errors/custom-errors';
import { IMessageRepository } from '../interfaces/message-repository.interface';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { Result } from '../logic/result';

export class CreateMessageUseCase {
  constructor(
    private readonly _messageRepository: IMessageRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  public async createMessage(
    message: Omit<Message, 'id'>,
  ): Promise<Result<Message>> {
    if (message.senderUsername == message.receiverUsername) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        message: 'Cannot send message to your username.',
      });
    }

    const existingSenderOrError = await this._userRepository.getUserByUsername(
      message.senderUsername,
    );
    const existingReceiverOrError =
      await this._userRepository.getUserByUsername(message.receiverUsername);
    if (existingSenderOrError.isFailure || existingReceiverOrError.isFailure) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        message: 'User does not exist.',
      });
    }
    const createdMessageOrError = await this._messageRepository.createMessage(
      message,
    );
    if (createdMessageOrError.isFailure) {
      return Result.fail(createdMessageOrError.getError());
    }
    const createdMessage = createdMessageOrError.getValue();
    return Result.ok<Message>(createdMessage);
  }
}
