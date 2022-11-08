export abstract class BaseMapper<EntityT> {
  public abstract toDomain(raw: any): EntityT;
  public abstract toPersistence(t: EntityT): any;
  public abstract toDTO(t: EntityT): any;
}
