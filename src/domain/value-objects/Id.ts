import { Result } from '@application/logic/Result';
import { IdService } from '@application/services/Id.service';
import { ValueObject } from '@domain/primitives/ValueObject';

type IdType = string;

export class Id extends ValueObject<IdType> {
  public static create(value?: IdType): Result<Id> {
    return Result.ok<Id>(
      new Id(IdService.isValidId(value) ? value : IdService.newId()),
    );
  }
}
