import { MessageHistoryDto } from '@application/contracts/dtos/message/MessageHistory.dto';
import { Message } from '@domain/entities/Message';
import { IRepository } from '@domain/interfaces/IRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMessageRepository extends IRepository<Message> {
  getMessageHistoryWithContact(
    username: string,
    contactUsername: string,
  ): Promise<MessageHistoryDto>;
}
