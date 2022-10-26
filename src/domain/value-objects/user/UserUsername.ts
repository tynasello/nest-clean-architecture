import { Guard } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/CustomErrors';

interface UserUsernameProps {
  value: string;
}

export class UserUsername {
  public readonly value: string;

  private constructor(props: UserUsernameProps) {
    this.value = props.value;
  }

  public static isValidUsername(username: string): boolean {
    if (username.length > 5) {
      return true;
    }
    return false;
  }

  public static create(props: UserUsernameProps): Result<UserUsername> {
    const { value } = props;

    const guardResult = Guard.againstNullOrUndefined(value, 'username');

    if (guardResult.isFailure) return guardResult;

    if (!this.isValidUsername(value)) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'Field *username* is invalid',
      });
    }

    const userUsername = new UserUsername({
      value,
    });

    return Result.ok<UserUsername>(userUsername);
  }
}
