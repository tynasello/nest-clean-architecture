import { UniqueEntityId } from './UniqueEntityId';

export class Entity<EntityPropsT> {
  protected readonly _id: UniqueEntityId;
  public readonly props: EntityPropsT;

  constructor(props: EntityPropsT, id?: UniqueEntityId) {
    this._id = id ? id : new UniqueEntityId();
    this.props = props;
  }
}
