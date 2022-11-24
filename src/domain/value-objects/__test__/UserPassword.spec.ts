import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { UserPassword } from '@domain/value-objects/user/UserPassword';

describe('UserPassword', () => {
  it('should return successful result with password when props are valid', () => {
    const validPassword = 'valid password';
    const userPasswordOrError = UserPassword.create(validPassword);
    expect(userPasswordOrError.isSuccess).toBe(true);
    expect(userPasswordOrError.getValue().value).toBe(validPassword);
  });

  it('should return failed result when password is null', () => {
    const userPasswordOrError = UserPassword.create(null);
    expect(userPasswordOrError.isFailure).toBe(true);
    expect(userPasswordOrError.getError()).toMatchObject({
      code: CUSTOM_ERRORS.USER_INPUT_ERROR,
      msg: `password must be greater than or equal to ${UserPassword.minPasswordLength} characters long`,
    });
  });

  it('should return failed result when password is too short', () => {
    const shortPassword = 'pa';
    const userPasswordOrError = UserPassword.create(shortPassword);
    expect(userPasswordOrError.isFailure).toBe(true);
    expect(userPasswordOrError.getError()).toMatchObject({
      code: CUSTOM_ERRORS.USER_INPUT_ERROR,
      msg: `password must be greater than or equal to ${UserPassword.minPasswordLength} characters long`,
    });
  });
});
