import { EntityMapperModule } from '@application/contracts/data-mappers/EntityMapper.module';
import { ServicesModule } from '@application/services/Services.module';
import { UseCasesModule } from '@application/use-cases/UseCases.module';
import { AuthController } from '@interface-adapters/controllers/Auth.controller';
import { UserController } from '@interface-adapters/controllers/User.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServicesModule,
    EntityMapperModule,
    UseCasesModule,
  ],
  controllers: [UserController, AuthController],
})
export class AppModule {}
