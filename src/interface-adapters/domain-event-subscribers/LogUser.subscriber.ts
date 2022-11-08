import { DomainEvent } from '@domain/events/DomainEventManager';
import { IDomainEventSubscriber } from '@domain/events/IDomainEventSubscriber';
import { UserGateway } from '@interface-adapters/gateways/User.gateway';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogUserSubscriber implements IDomainEventSubscriber {
  constructor(private readonly userGateway: UserGateway) {}

  public update(domainEvent: DomainEvent, payload: any) {
    const user = payload.user || null;
    this.userGateway.emitUserCreated(domainEvent, user);
  }
}
