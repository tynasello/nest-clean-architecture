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
    if (!this.isValidUsername(value)) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `username must be greater than or equal to ${UserUsername.minUsernameLength} characters long`,
      });
    }

    return Result.ok<UserUsername>(new UserUsername(value));
  }
}
