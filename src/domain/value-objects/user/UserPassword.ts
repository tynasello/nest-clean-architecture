import { GuardProps } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { ValueObject } from '@domain/primitives/ValueObject';

type UserPasswordValue = string;

export class UserPassword extends ValueObject<UserPasswordValue> {
  private static readonly minPasswordLength = 5;

  public static isValidPassword(password: UserPasswordValue): boolean {
    if (password.length < UserPassword.minPasswordLength) {
      return false;
    }
    return true;
  }

  public static create(value: UserPasswordValue): Result<UserPassword> {
    const guardResult = GuardProps.againstNullOrUndefined(value, 'password');

    if (guardResult.isFailure) return Result.fail(guardResult.getError());

    if (!this.isValidPassword(value)) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'Field *password* is invalid',
      });
    }

    return Result.ok<UserPassword>(new UserPassword(value));
  }
}
