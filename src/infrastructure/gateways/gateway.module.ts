import { Module } from '@nestjs/common';
import { AuthTokenModule } from '../services/auth-token/auth-token.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [AuthTokenModule],
  providers: [MessageGateway],
  exports: [MessageGateway],
})
export class GatewayModule {}
