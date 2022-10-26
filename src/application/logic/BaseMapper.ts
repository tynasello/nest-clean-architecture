export interface BaseMapper<EntityT> {
  toDomain(raw: any): EntityT;
  toPersistence(t: EntityT): any;
  toDTO(t: EntityT): any;
}
