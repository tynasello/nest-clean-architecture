import { Message } from '../../domain/entities/message';

export interface IMessageGateway {
  newMessageCreated(payload: Message): void;
}
