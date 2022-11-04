import { AuthService } from '@application/use-cases/Auth.service';
import { UserService } from '@application/use-cases/User.service';
import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { AccessTokenStrategy } from '@interface-adapters/auth-strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '@interface-adapters/auth-strategies/refreshToken.strategy';
import { CacheService } from '@interface-adapters/Cache.service';
import { AuthController } from '@interface-adapters/controllers/Auth.controller';
import { UserController } from '@interface-adapters/controllers/User.controller';
import { UserMap } from '@interface-adapters/dal/mappers/UserMap';
import { DatabaseService } from '@interface-adapters/Database.sevice';
import { UserGateway } from '@interface-adapters/gateways/User.gateway';
import { UserRepository } from '@interface-adapters/repositories/UserRepository';
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
      ttl: 0,
    }),
    JwtModule.register({}),
  ],
  controllers: [UserController, AuthController],
  providers: [
    CacheService,
    PrismaService,
    DatabaseService,
    { provide: 'BaseMapper<User>', useClass: UserMap },
    { provide: 'IUserRepository', useClass: UserRepository },
    UserService,
    AuthService,
    UserGateway,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {}
