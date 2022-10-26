import { Guard } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/CustomErrors';

interface UserPasswordProps {
  value: string;
}

export class UserPassword {
  public readonly value: string;

  private constructor(props: UserPasswordProps) {
    this.value = props.value;
  }

  //* bcrypt logic

  public static isValidPassword(password: string): boolean {
    if (password.length > 5) {
      return true;
    }
    return false;
  }

  public static create(props: UserPasswordProps): Result<UserPassword> {
    const { value } = props;

    const guardResult = Guard.againstNullOrUndefined(value, 'password');

    if (guardResult.isFailure) return guardResult;

    if (!this.isValidPassword(value)) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'Field *password* is invalid',
      });
    }
    const userPassword = new UserPassword({
      value,
    });

    return Result.ok<UserPassword>(userPassword);
  }
}
