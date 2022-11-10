import { AuthTokenService } from '@application/services/AuthToken.service';
import { CacheService } from '@application/services/Cache.service';
import { DatabaseService } from '@application/services/Database.sevice';
import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 600,
    }),
    JwtModule.register({}),
  ],
  providers: [AuthTokenService, CacheService, DatabaseService, PrismaService],
  exports: [AuthTokenService, CacheService, DatabaseService],
})
export class ServicesModule {}
