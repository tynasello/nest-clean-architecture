import { AuthService } from '@application/use-cases/Auth.service';
import { UserService } from '@application/use-cases/User.service';
import { DomainEventManager } from '@domain/events/DomainEventManager';
import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { AccessTokenStrategy } from '@interface-adapters/auth-strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '@interface-adapters/auth-strategies/refreshToken.strategy';
import { AuthController } from '@interface-adapters/controllers/Auth.controller';
import { UserController } from '@interface-adapters/controllers/User.controller';
import { LogUserSubscriber } from '@interface-adapters/domain-event-subscribers/LogUser.subscriber';
import { UserGateway } from '@interface-adapters/gateways/User.gateway';
import { UserRepository } from '@interface-adapters/repositories/UserRepository';
import { AuthTokenService } from '@interface-adapters/services/AuthToken.service';
import { CacheService } from '@interface-adapters/services/Cache.service';
import { DatabaseService } from '@interface-adapters/services/Database.sevice';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 600,
    }),
    JwtModule.register({}),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserGateway,
    CacheService,
    PrismaService,
    DatabaseService,
    DomainEventManager,
    LogUserSubscriber,
    { provide: 'IUserRepository', useClass: UserRepository },
    UserService,
    AuthService,
    AuthTokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {}
