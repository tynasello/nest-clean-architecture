import { AggregateRoot } from '@domain/AggregateRoot';
import { GatewayType } from '@domain/Gateway.type';

export interface IDomainEventSubscriber {
  update(gateway?: GatewayType, aggregate?: AggregateRoot<any>): void;
}
