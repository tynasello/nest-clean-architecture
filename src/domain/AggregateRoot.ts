import { Entity } from './Entity';

export class AggregateRoot<EntityPropsT> extends Entity<EntityPropsT> {
  protected addDomainEvent() {
    return;
  }
}
