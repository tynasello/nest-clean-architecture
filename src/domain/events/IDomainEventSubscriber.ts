import { DomainEvent } from './DomainEventManager';

export interface IDomainEventSubscriber {
  update(event: DomainEvent, payload: any): void;
}
