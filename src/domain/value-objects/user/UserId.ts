import { Guard } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';

interface UserIdProps {
  value: string;
}

export class UserId {
  public readonly value: string;

  private constructor(props: UserIdProps) {
    this.value = props.value;
  }

  public static create(props: UserIdProps): Result<UserId> {
    const { value } = props;

    const guardResult = Guard.againstNullOrUndefined(value, 'id');

    if (guardResult.isFailure) return guardResult;

    const userId = new UserId({
      value,
    });

    return Result.ok<UserId>(userId);
  }
}
