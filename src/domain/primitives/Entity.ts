export class Entity<EntityPropsT> {
  public readonly props: EntityPropsT;

  constructor(props: EntityPropsT) {
    this.props = props;
  }
}
