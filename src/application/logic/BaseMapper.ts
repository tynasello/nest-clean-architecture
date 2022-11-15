import { Result } from '@application/logic/Result';

export interface BaseMapper<EntityT> {
  persistanceToDomain(raw: any): Promise<EntityT | null> | EntityT | null;
  dtoToDomain(dto: any): Promise<Result<EntityT>> | Result<EntityT>;
  domainToPersistence(entity: EntityT): any;
  domainToDTO(entity: EntityT): any;
}
