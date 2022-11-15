import { MessageHistory } from '@application/contracts/dtos/message/MessageHistory';
import { Message } from '@domain/entities/Message';
import { IRepository } from '@domain/interfaces/IRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMessageRepository extends IRepository<Message> {
  getMessageHistoryWithContact(
    username: string,
    contactUsername: string,
  ): Promise<MessageHistory>;
}
