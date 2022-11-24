import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { ValueObject } from '@domain/primitives/ValueObject';

type UserPasswordValue = string;

export class UserPassword extends ValueObject<UserPasswordValue> {
  public static readonly minPasswordLength = 5;

  private static isValidPassword(password: UserPasswordValue): boolean {
    if (password.length < UserPassword.minPasswordLength) {
      return false;
    }
    return true;
  }

  public static create(value: UserPasswordValue): Result<UserPassword> {
    if (!value || !this.isValidPassword(value)) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `password must be greater than or equal to ${UserPassword.minPasswordLength} characters long`,
      });
    }

    return Result.ok<UserPassword>(new UserPassword(value));
  }
}
