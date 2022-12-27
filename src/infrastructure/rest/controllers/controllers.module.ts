import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from 'src/infrastructure/common/strategies/access-token.strategy';
import { AuthTokenModule } from 'src/infrastructure/services/auth-token/auth-token.module';
import { UseCaseProxyModule } from '../../use-cases-proxy/use-cases-proxy.module';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';

@Module({
  imports: [UseCaseProxyModule.register(), AuthTokenModule],
  providers: [AccessTokenStrategy],
  controllers: [AuthController, UserController],
})
export class ControllersModule {}
