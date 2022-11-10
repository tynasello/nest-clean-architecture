import { BaseMapper } from '@application/logic/BaseMapper';
import { AuthTokenService } from '@application/services/AuthToken.service';
import { UserService } from '@application/use-cases/User.service';
import { User } from '@domain/entities/User';
import { DomainEventEnum } from '@domain/events/DomainEventManager';
import { IUserGateway } from '@domain/interfaces/gateways/IUserGateway';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: 'user-events' })
export class UserGateway implements IUserGateway {
  @WebSocketServer()
  server: Server;

  connectedUser: User;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly authTokenService: AuthTokenService,
    @Inject('BaseMapper<User>') private readonly userMap: BaseMapper<User>,
  ) {}

  public async handleConnection(socket: Socket) {
    // console.log('WS Connect');
    try {
      const authorizationHeader = socket.handshake.headers.authorization;
      const accessToken = authorizationHeader.split(' ')[1];
      const jwtPayload = this.authTokenService.decodeJwt(accessToken);

      const exp = jwtPayload.exp;
      if (Date.now() >= exp * 1000) await this.handleDisconnect(socket);

      const username = jwtPayload.username;
      const user = await this.userService.getUserByUsername(username);
      if (user.isFailure) await this.handleDisconnect(socket);
      this.connectedUser = user.getValue();
    } catch {
      return await this.handleDisconnect(socket);
    }

    return;
  }

  public async handleDisconnect(socket: Socket) {
    // console.log('WS Disconnect');
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  public emitUserCreated(event: DomainEventEnum, user?: User) {
    this.server.emit(event, user ? this.userMap.domainToDTO(user) : null);
  }
}
