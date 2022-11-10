import { UserMap } from '@application/contracts/data-mappers/UserMap';
import { Module } from '@nestjs/common';

@Module({
  providers: [{ provide: 'BaseMapper<User>', useClass: UserMap }],
  exports: ['BaseMapper<User>'],
})
export class EntityMapperModule {}
