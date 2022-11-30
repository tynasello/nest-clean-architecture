import { AuthTokenService } from '@application/services/AuthToken.service';
import { CacheService } from '@application/services/Cache.service';
import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CacheModule.register({
      ttl: 600,
    }),
    JwtModule.register({}),
  ],
  providers: [AuthTokenService, CacheService],
  exports: [AuthTokenService, CacheService],
})
export class ServicesModule {}
