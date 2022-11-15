import { BaseMapper } from '@application/logic/BaseMapper';
import { AuthTokenService } from '@application/services/AuthToken.service';
import { UserService } from '@application/use-cases/User.service';
import { Message } from '@domain/entities/Message';
import { User } from '@domain/entities/User';
import { DomainEventEnum } from '@domain/events/DomainEventManager';
import { IMessageGateway } from '@domain/interfaces/gateways/IMessageGateway';
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
export class MessageGateway implements IMessageGateway {
  @WebSocketServer()
  server: Server;

  connectedUser: User;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly authTokenService: AuthTokenService,
    @Inject('BaseMapper<Message>')
    private readonly messageMap: BaseMapper<Message>,
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

  public emitMessageCreated(event: DomainEventEnum, message?: Message) {
    if (!this.connectedUser) return;

    if (
      message?.props.receiver.props.id.value ===
      this.connectedUser.props.id.value
    )
      this.server.emit(
        event,
        message ? this.messageMap.domainToDTO(message) : null,
      );
  }
}
