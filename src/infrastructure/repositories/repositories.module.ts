import { Module } from '@nestjs/common';
import { FakeUserRepository } from '../../__test__/fake-adapters/fake-user.repository';
import { PrismaModule } from '../services/prisma/prisma.module';
import { MessageRepository } from './message/message.repository';
import { UserRepository } from './user/user.repository';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository, FakeUserRepository, MessageRepository],
  exports: [UserRepository, FakeUserRepository, MessageRepository],
})
export class RepositoriesModule {}
