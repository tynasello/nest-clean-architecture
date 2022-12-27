import { Module } from '@nestjs/common';
import { PrismaService } from '../db/prisma/prisma.service';
import { UserRepository } from './user/user.repository';

@Module({
  providers: [PrismaService, UserRepository],
  exports: [UserRepository],
})
export class RepositoriesModule {}
