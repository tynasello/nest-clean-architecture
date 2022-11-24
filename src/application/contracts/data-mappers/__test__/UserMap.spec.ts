import { UserMap } from '@application/contracts/data-mappers/UserMap';
import { SignupUserRequestDto } from '@application/contracts/dtos/user/SignupUser.request.dto';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';

describe('UserMap', () => {
  const userMap = new UserMap();

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('dtoToDomain', () => {
    const validCreateUserDto: SignupUserRequestDto = {
      username: 'username',
      password: 'password',
      profileColor: 'blue',
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return successful result of user when all props are valid', () => {
      const result = userMap.dtoToDomain(validCreateUserDto);
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().props).toMatchObject({
        id: { value: expect.any(String) },
        username: { value: validCreateUserDto.username },
        password: { value: validCreateUserDto.password },
        refreshToken: undefined,
        profileColor: { value: validCreateUserDto.profileColor },
      });
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return successful result of user even if invalid profile color is passed in', () => {
      const result = userMap.dtoToDomain({
        ...validCreateUserDto,
        profileColor: 'invalid',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().props.profileColor.value).toBe(
        UserProfileColor.defaultUserProfileColor,
      );
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return failed result of user when username is invalid', () => {
      const result = userMap.dtoToDomain({
        ...validCreateUserDto,
        username: '1',
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toMatchObject({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'username must be greater than or equal to 5 characters long',
      });
    });
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return failed result when username is invalid', () => {
      const result = userMap.dtoToDomain({
        ...validCreateUserDto,
        username: '1',
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toMatchObject({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'username must be greater than or equal to 5 characters long',
      });
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return failed result when password is invalid', () => {
      const result = userMap.dtoToDomain({
        ...validCreateUserDto,
        password: '1',
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toMatchObject({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'password must be greater than or equal to 5 characters long',
      });
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  });
});
