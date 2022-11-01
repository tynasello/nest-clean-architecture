import { Entity } from './Entity';
import { DomainEventManager } from './events/DomainEventManager';
import { IDomainEvent } from './events/IDomainEvent';

export class AggregateRoot<EntityPropsT> extends Entity<EntityPropsT> {
  protected addDomainEvent(domainEvent: IDomainEvent) {
    DomainEventManager.clearSubscriptionsForDomainEvent(
      domainEvent.constructor.name,
    );
    DomainEventManager.registerDomainEvent(domainEvent);
    domainEvent.setupDomainEventSubscriptions();
  }
}
