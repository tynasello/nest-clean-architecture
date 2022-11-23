import { UseCasesModule } from '@application/use-cases/UseCases.module';
import { forwardRef, Module } from '@nestjs/common';
import { MessageMap } from './MessageMap';
import { UserMap } from './UserMap';

@Module({
  imports: [forwardRef(() => UseCasesModule)],
  providers: [
    { provide: 'BaseMapper<User>', useClass: UserMap },
    { provide: 'BaseMapper<Message>', useClass: MessageMap },
  ],
  exports: ['BaseMapper<User>', 'BaseMapper<Message>'],
})
export class DataMapperModule {}
