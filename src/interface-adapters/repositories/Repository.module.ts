import { DataMapperModule } from '@application/contracts/data-mappers/DataMapper.module';
import { ServicesModule } from '@application/services/Services.module';
import { UseCasesModule } from '@application/use-cases/UseCases.module';
import { forwardRef, Module } from '@nestjs/common';
import { MessageRepository } from './Message.repository';
import { UserRepository } from './User.repository';

@Module({
  imports: [
    forwardRef(() => UseCasesModule),
    ServicesModule,
    forwardRef(() => DataMapperModule),
  ],
  providers: [
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IMessageRepository', useClass: MessageRepository },
  ],
  exports: ['IUserRepository', 'IMessageRepository'],
})
export class RepositoryModule {}
