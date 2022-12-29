import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FakeUserRepository } from 'src/__test__/fake-adapters/fake-user.repository';
import { PrismaService, TestPrismaService } from '../db/prisma/prisma.service';
import { MessageRepository } from './message/message.repository';
import { UserRepository } from './user/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  providers: [
    PrismaService,
    UserRepository,
    FakeUserRepository,
    MessageRepository,
  ],
  exports: [UserRepository, FakeUserRepository, MessageRepository],
})
export class RepositoriesModule {}
