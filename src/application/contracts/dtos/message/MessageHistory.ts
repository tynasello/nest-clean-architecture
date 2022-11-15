import { Message } from '@domain/entities/Message';

export class MessageHistory {
  sentMessages: Message[];
  receivedMessages: Message[];
}
