import { AggregateRoot } from '@domain/AggregateRoot';

export interface IDomainEventSubscriber {
  update(aggregate?: AggregateRoot<any>): void;
}
