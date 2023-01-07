import { Message } from '../../domain/entities/message';
import { CUSTOM_ERRORS } from '../../domain/errors/custom-errors';
import { IMessageRepository } from '../interfaces/message-repository.interface';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { Result } from '../logic/result';

export class GetMessageHistoryWithUsernameUseCase {
  constructor(
    private readonly _messageRepository: IMessageRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  public async getMessageHistoryWithUsername(
    username: string,
    otherUsername: string,
  ): Promise<Result<Message[]>> {
    if (username == otherUsername) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        message: 'Cannot get message history with your username.',
      });
    }
    const existingSenderOrError = await this._userRepository.getUserByUsername(
      username,
    );
    const existingReceiverOrError =
      await this._userRepository.getUserByUsername(otherUsername);
    if (existingSenderOrError.isFailure || existingReceiverOrError.isFailure) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        message: 'User does not exist.',
      });
    }
    const existingMessageHistoryWithUsernameOrError =
      await this._messageRepository.getMessageHistoryWithUsername(
        username,
        otherUsername,
      );
    if (existingMessageHistoryWithUsernameOrError.isFailure) {
      return Result.fail(existingMessageHistoryWithUsernameOrError.getError());
    }
    const existingMessageHistoryWithUsername =
      existingMessageHistoryWithUsernameOrError.getValue();
    return Result.ok<Message[]>(existingMessageHistoryWithUsername);
  }
}
