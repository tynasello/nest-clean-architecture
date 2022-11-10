import { GuardProps } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { ValueObject } from '@domain/primitives/ValueObject';

type UserUsernameValue = string;

export class UserUsername extends ValueObject<UserUsernameValue> {
  private static readonly minUsernameLength = 5;

  public static isValidUsername(username: UserUsernameValue): boolean {
    if (username.length < UserUsername.minUsernameLength) {
      return false;
    }
    return true;
  }

  public static create(value: UserUsernameValue): Result<UserUsername> {
    const guardResult = GuardProps.againstNullOrUndefined(value, 'username');

    if (guardResult.isFailure) return Result.fail(guardResult.getError());

    if (!this.isValidUsername(value)) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'Field *username* is invalid',
      });
    }

    return Result.ok<UserUsername>(new UserUsername(value));
  }
}
