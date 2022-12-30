import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { Server } from 'socket.io';
import { IMessageGateway } from 'src/application/interfaces/message-gateway.interface';
import { AuthTokenService } from '../services/auth-token/auth-token.service';
import { Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway()
export class MessageGateway implements IMessageGateway {
  constructor(private readonly _authTokenService: AuthTokenService) {}

  @WebSocketServer()
  wss: Server;

  connectedUsername: string;

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
      this.connectedUsername = jwtPayload.username;
    } catch {
      return await this.handleDisconnect(socket);
    }
    return;
  }

  public async handleDisconnect(socket: Socket) {
    socket.emit('Web socket connection error.', new UnauthorizedException());
    socket.disconnect();
  }

  newMessageCreated(payload: Message): void {
    // if no connectedUser (user is not authenticated) return
    if (
      !this.connectedUsername ||
      this.connectedUsername != payload.receiverUsername
    )
      return;
    this.wss.emit('newMessageCreated', payload);
  }
}
