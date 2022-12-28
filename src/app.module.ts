import { Module } from '@nestjs/common';
import { ControllersModule } from './infrastructure/rest/controllers/controllers.module';
@Module({
  imports: [ControllersModule],
})
export class AppModule {}
