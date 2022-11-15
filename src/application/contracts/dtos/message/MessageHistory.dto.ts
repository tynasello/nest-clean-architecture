import { Message } from '@domain/entities/Message';

export class MessageHistoryDto {
  sentMessages: Message[];
  receivedMessages: Message[];
}
