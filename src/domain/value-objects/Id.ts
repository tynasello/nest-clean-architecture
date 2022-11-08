import { Result } from '@application/logic/Result';
import { IdService } from '@interface-adapters/services/Id.service';

interface IdProps {
  value: string;
}

export class Id {
  public readonly value: string;

  private constructor(props: IdProps) {
    this.value = props.value;
  }

  public static create(props: IdProps): Result<Id> {
    const id = new Id({
      value: IdService.isValidId(props.value) ? props.value : IdService.newId(),
    });

    return Result.ok<Id>(id);
  }
}
