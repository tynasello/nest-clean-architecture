import { MessageMap } from '@application/contracts/data-mappers/MessageMap';
import { UserMap } from '@application/contracts/data-mappers/UserMap';
import { ServicesModule } from '@application/services/Services.module';
import { AuthService } from '@application/use-cases/Auth.service';
import { UserService } from '@application/use-cases/User.service';
import { DomainEventManager } from '@domain/events/DomainEventManager';
import { PrismaService } from '@infrastructure/db/prisma/Prisma.service';
import { AccessTokenStrategy } from '@interface-adapters/auth-strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '@interface-adapters/auth-strategies/refreshToken.strategy';
import { LogUserSubscriber } from '@interface-adapters/domain-event-subscribers/LogUser.subscriber';
import { UserGateway } from '@interface-adapters/gateways/User.gateway';
import { MessageRepository } from '@interface-adapters/repositories/Message.repository';
import { UserRepository } from '@interface-adapters/repositories/User.repository';
import { Module } from '@nestjs/common';
import { MessageService } from './Message.service';

@Module({
  imports: [ServicesModule],
  providers: [
    PrismaService,
    AuthService,
    UserService,
    MessageService,

    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IMessageRepository', useClass: MessageRepository },

    { provide: 'BaseMapper<User>', useClass: UserMap },
    { provide: 'BaseMapper<Message>', useClass: MessageMap },

    { provide: 'ILogUserSubscriber', useClass: LogUserSubscriber },

    { provide: 'IUserGateway', useClass: UserGateway },

    DomainEventManager,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [
    AuthService,
    UserService,
    MessageService,
    'BaseMapper<User>',
    'BaseMapper<Message>',
  ],
})
export class UseCasesModule {}
