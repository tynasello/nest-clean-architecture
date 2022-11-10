import { EntityMapperModule } from '@application/contracts/data-mappers/EntityMapper.module';
import { ServicesModule } from '@application/services/Services.module';
import { AuthService } from '@application/use-cases/Auth.service';
import { UserService } from '@application/use-cases/User.service';
import { DomainEventManager } from '@domain/events/DomainEventManager';
import { AccessTokenStrategy } from '@interface-adapters/auth-strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '@interface-adapters/auth-strategies/refreshToken.strategy';
import { LogUserSubscriber } from '@interface-adapters/domain-event-subscribers/LogUser.subscriber';
import { UserGateway } from '@interface-adapters/gateways/User.gateway';
import { UserRepository } from '@interface-adapters/repositories/User.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [ServicesModule, EntityMapperModule],
  providers: [
    AuthService,
    UserService,
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'ILogUserSubscriber', useClass: LogUserSubscriber },
    { provide: 'IUserGateway', useClass: UserGateway },
    DomainEventManager,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService, UserService],
})
export class UseCasesModule {}
