import { ServicesModule } from '@application/services/Services.module';
import { UseCasesModule } from '@application/use-cases/UseCases.module';
import { AuthController } from '@interface-adapters/controllers/Auth.controller';
import { MessageController } from '@interface-adapters/controllers/Message.controller';
import { UserController } from '@interface-adapters/controllers/User.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServicesModule,
    UseCasesModule,
  ],
  controllers: [UserController, AuthController, MessageController],
})
export class AppModule {}
