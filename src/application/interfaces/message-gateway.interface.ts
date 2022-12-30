import { Message } from 'src/domain/entities/message';

export interface IMessageGateway {
  newMessageCreated(payload: Message): void;
}
