import { DataMapperModule } from '@application/contracts/data-mappers/DataMapper.module';
import { ServicesModule } from '@application/services/Services.module';
import { UseCasesModule } from '@application/use-cases/UseCases.module';
import { MessageGateway } from '@interface-adapters/gateways/Message.gateway';
import { UserGateway } from '@interface-adapters/gateways/User.gateway';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => UseCasesModule),
    ServicesModule,
    forwardRef(() => DataMapperModule),
  ],
  providers: [
    { provide: 'IUserGateway', useClass: UserGateway },
    { provide: 'IMessageGateway', useClass: MessageGateway },
  ],
  exports: ['IUserGateway', 'IMessageGateway'],
})
export class GatewayModule {}
