import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ControllersModule } from './infrastructure/rest/controllers/controllers.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ControllersModule,
  ],
})
export class AppModule {}
