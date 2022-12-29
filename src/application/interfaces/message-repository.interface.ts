import { Result } from 'src/application/logic/result';
import { Message } from 'src/domain/entities/message';

export interface IMessageRepository {
  createMessage(message: Omit<Message, 'id'>): Promise<Result<Message>>;
  getMessageHistoryWithUsername(
    username: string,
    otherUsername: string,
  ): Promise<Result<Message[]>>;
}
