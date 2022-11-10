import { User } from '@domain/entities/User';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

export interface IUserGateway extends OnGatewayConnection, OnGatewayDisconnect {
  emitUserCreated(event: string, user: User): void;
}
