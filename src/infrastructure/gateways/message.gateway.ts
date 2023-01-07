import { UnauthorizedException } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { IMessageGateway } from '../../application/interfaces/message-gateway.interface';
import { AuthTokenService } from '../services/auth-token/auth-token.service';

@WebSocketGateway()
export class MessageGateway implements IMessageGateway {
  constructor(private readonly _authTokenService: AuthTokenService) {}

  @WebSocketServer()
  private _wss: Server;

  private _connectedUsername: string;

  private static NEW_MESSAGE_CREATED = 'NEW_MESSAGE_CREATED';

  public async handleConnection(socket: Socket) {
    try {
      const authorizationHeader = socket.handshake.headers.authorization;
      const accessToken = authorizationHeader.split(' ')[1];
      const accessTokenIsValid = await this._authTokenService.verifyAuthToken(
        accessToken,
      );
      if (!accessTokenIsValid) {
        await this.handleDisconnect(socket);
      }
      const jwtPayload = this._authTokenService.decodeAuthToken(accessToken);
      this._connectedUsername = jwtPayload.username;
    } catch {
      return await this.handleDisconnect(socket);
    }
    return;
  }

  public async handleDisconnect(socket: Socket) {
    socket.emit('Web socket connection error.', new UnauthorizedException());
    socket.disconnect();
  }

  public newMessageCreated(payload: Message): void {
    // if no connectedUser (user is not authenticated) return
    if (
      !this._connectedUsername ||
      this._connectedUsername != payload.receiverUsername
    )
      return;
    this._wss.emit(MessageGateway.NEW_MESSAGE_CREATED, payload);
  }
}
