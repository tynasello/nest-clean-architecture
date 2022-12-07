import { DataMapperModule } from '@application/contracts/data-mappers/DataMapper.module';
import { ServicesModule } from '@application/services/Services.module';
import { AuthService } from '@application/use-cases/Auth.service';
import { UserService } from '@application/use-cases/User.service';
import { DomainEventManager } from '@domain/events/DomainEventManager';
import { PrismaService } from '@infrastructure/prisma/Prisma.service';
import { AccessTokenStrategy } from '@interface-adapters/auth-strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '@interface-adapters/auth-strategies/refreshToken.strategy';
import { DomainEventsSubscriberModule } from '@interface-adapters/domain-event-subscribers/DomainEventSubscriber.module';
import { RepositoryModule } from '@interface-adapters/repositories/Repository.module';
import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './Message.service';

@Module({
  imports: [
    ServicesModule,
    DomainEventsSubscriberModule,
    forwardRef(() => DataMapperModule),
    forwardRef(() => RepositoryModule),
  ],
  providers: [
    PrismaService,
    AuthService,
    UserService,
    MessageService,

    DomainEventManager,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [
    AuthService,
    UserService,
    MessageService,
    DomainEventManager,
    PrismaService,
  ],
})
export class UseCasesModule {}
