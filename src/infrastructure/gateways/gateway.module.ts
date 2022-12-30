import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthTokenModule } from '../services/auth-token/auth-token.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    AuthTokenModule,
  ],
  providers: [MessageGateway],
  exports: [MessageGateway],
})
export class GatewayModule {}
