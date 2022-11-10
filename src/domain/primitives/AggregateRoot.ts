import { IdService } from '@application/services/Id.service';
import { Entity } from '@domain/primitives/Entity';

type AggregateRootId = string;
export class AggregateRoot<EntityPropsT> extends Entity<EntityPropsT> {
  public readonly aggregateId: AggregateRootId;

  constructor(props: EntityPropsT) {
    super(props);
    this.aggregateId = IdService.newId();
  }
}
