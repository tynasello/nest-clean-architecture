import { AuthTokenService } from '@application/services/AuthToken.service';
import { CacheService } from '@application/services/Cache.service';
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
  providers: [AuthTokenService, CacheService],
  exports: [AuthTokenService, CacheService],
})
export class ServicesModule {}
