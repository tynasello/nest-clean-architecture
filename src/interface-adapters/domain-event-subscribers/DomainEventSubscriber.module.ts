import { GatewayModule } from '@interface-adapters/gateways/Gateway.module';
import { forwardRef, Module } from '@nestjs/common';
import { LogMessageSubscriber } from './LogMessage.subscriber';
import { LogUserSubscriber } from './LogUser.subscriber';

@Module({
  imports: [forwardRef(() => GatewayModule)],
  providers: [
    { provide: 'ILogUserSubscriber', useClass: LogUserSubscriber },
    { provide: 'ILogMessageSubscriber', useClass: LogMessageSubscriber },
  ],
  exports: ['ILogUserSubscriber', 'ILogMessageSubscriber'],
})
export class DomainEventsSubscriberModule {}
