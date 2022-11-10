import { Result } from '@application/logic/Result';

export interface BaseMapper<EntityT> {
  persistanceToDomain(raw: any): EntityT | null;
  dtoToDomain(dto: any): Result<EntityT>;
  domainToPersistence(entity: EntityT): any;
  domainToDTO(entity: EntityT): any;
}
