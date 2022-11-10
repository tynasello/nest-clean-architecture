import { DomainEventEnum } from '../events/DomainEventManager';

export interface IDomainEventSubscriber {
  update(event: DomainEventEnum, payload: any): void;
}
