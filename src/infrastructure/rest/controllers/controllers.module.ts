import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from '../../common/strategies/access-token.strategy';
import { AuthTokenModule } from '../../services/auth-token/auth-token.module';
import { UseCaseProxyModule } from '../../use-cases-proxy/use-cases-proxy.module';
import { AuthController } from './auth.controller';
import { MessageController } from './message.controller';
import { UserController } from './user.controller';

@Module({
  imports: [
    UseCaseProxyModule.register({ useFakeImplementations: false }),
    AuthTokenModule,
  ],
  providers: [AccessTokenStrategy],
  controllers: [AuthController, UserController, MessageController],
})
export class ControllersModule {}
