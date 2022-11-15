import { Message } from '@domain/entities/Message';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

export interface IMessageGateway
  extends OnGatewayConnection,
    OnGatewayDisconnect {
  emitMessageCreated(event: string, message: Message): void;
}
