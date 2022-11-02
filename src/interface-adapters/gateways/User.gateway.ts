import { User } from '@domain/aggregates/User';
import { IUserGateway } from '@domain/interfaces/IUserGateway';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Namespace } from 'socket.io';

@WebSocketGateway({ namespace: 'user-events' })
export class UserGateway implements IUserGateway {
  @WebSocketServer()
  server: Namespace;

  // @SubscribeMessage('message')
  // handleMessage(@MessageBody() message: string): void {
  //   this.server.emit('message', message);
  // }

  public emitUserCreated(event: string, user: User) {
    this.server.emit(event, { user });
  }
}
