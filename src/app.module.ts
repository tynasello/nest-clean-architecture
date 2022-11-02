import { UserService } from '@application/use-cases/User.service';
import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { CacheService } from '@interface-adapters/Cache.service';
import { UserController } from '@interface-adapters/controllers/User.controller';
import { UserMap } from '@interface-adapters/dal/mappers/UserMap';
import { DatabaseService } from '@interface-adapters/Database.sevice';
import { UserGateway } from '@interface-adapters/gateways/User.gateway';
import { UserRepository } from '@interface-adapters/repositories/UserRepository';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  ],
  controllers: [UserController],
  providers: [
    CacheService,
    PrismaService,
    DatabaseService,
    { provide: 'BaseMapper<User>', useClass: UserMap },
    { provide: 'IUserRepository', useClass: UserRepository },
    UserService,
    UserGateway,
  ],
})
export class AppModule {}
