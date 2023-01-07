import { Message } from '../../domain/entities/message';
import { Result } from '../logic/result';

export interface IMessageRepository {
  createMessage(message: Omit<Message, 'id'>): Promise<Result<Message>>;
  getMessageHistoryWithUsername(
    username: string,
    otherUsername: string,
  ): Promise<Result<Message[]>>;
}
