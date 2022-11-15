import { DomainEventEnum } from '@domain/events/DomainEventManager';
import { IMessageGateway } from '@domain/interfaces/gateways/IMessageGateway';
import { ILogMessageSubscriber } from '@domain/interfaces/subscribers/ILogMessageSubscriber';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class LogMessageSubscriber implements ILogMessageSubscriber {
  constructor(
    @Inject('IMessageGateway') private readonly messageGateway: IMessageGateway,
  ) {}

  public update(domainEvent: DomainEventEnum, payload: any) {
    const message = payload?.message;
    this.messageGateway.emitMessageCreated(domainEvent, message);
  }
}
