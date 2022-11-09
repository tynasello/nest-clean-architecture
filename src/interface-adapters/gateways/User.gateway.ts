import { UserService } from '@application/use-cases/User.service';
import { User } from '@domain/entities/User';
import { DomainEvent } from '@domain/events/DomainEventManager';
import { IUserGateway } from '@domain/interfaces/IUserGateway';
import { UserMap } from '@interface-adapters/dal/mappers/UserMap';
import { AuthTokenService } from '@interface-adapters/services/AuthToken.service';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: 'user-events' })
export class UserGateway
  implements OnGatewayConnection, OnGatewayDisconnect, IUserGateway
{
  @WebSocketServer()
  server: Server;

  user: User;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  public async handleConnection(socket: Socket) {
    console.log('WS Connected');
    try {
      const authorizationHeader: string =
        socket.handshake.headers.authorization;
      const accessToken = authorizationHeader.split(' ')[1];
      const jwtPayload = this.authTokenService.decodeJwt(accessToken);

      const exp = jwtPayload.exp;
      if (Date.now() >= exp * 1000) this.disconnect(socket);

      const username = jwtPayload.username;
      const user = await this.userService.getUserByUsername(username);

      if (user.isFailure) this.disconnect(socket);
      this.user = user.getValue();
    } catch {
      return this.disconnect(socket);
    }

    return;
  }

  public handleDisconnect() {
    return;
  }

  private disconnect(socket: Socket) {
    console.log('WS Disconnected');
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  public emitUserCreated(event: DomainEvent, user?: User) {
    this.server.emit(event, user ? UserMap.toDTO(user) : null);
  }
}
