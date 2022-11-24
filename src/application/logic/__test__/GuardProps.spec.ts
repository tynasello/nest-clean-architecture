import { GuardProps } from '@application/logic/GuardProps';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';

describe('GuardProps', () => {
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('againstNullOrUndefined', () => {
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return failed result if argument is null', () => {
      const argument = null;
      const argumentName = 'argumentName';
      const resultOrError = GuardProps.againstNullOrUndefined(
        argument,
        argumentName,
      );
      expect(resultOrError.isFailure).toBe(true);
      expect(resultOrError.getError()).toMatchObject({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `Field *${argumentName}* is null or undefined`,
      });
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return failed result if argument is undefined', () => {
      const argument = undefined;
      const argumentName = 'argumentName';
      const resultOrError = GuardProps.againstNullOrUndefined(
        argument,
        argumentName,
      );
      expect(resultOrError.isFailure).toBe(true);
      expect(resultOrError.getError()).toMatchObject({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `Field *${argumentName}* is null or undefined`,
      });
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should return successful result if argument is not null or undefined', () => {
      const argument = 'argument';
      const argumentName = 'argumentName';
      const resultOrError = GuardProps.againstNullOrUndefined(
        argument,
        argumentName,
      );
      expect(resultOrError.isSuccess).toBe(true);
      expect(resultOrError.getValue()).toBe(argument);
    });
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('againstIncorrectType', () => {
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should returns failed result if argument does not match desired type', () => {
      const argument = 'argument';
      const argumentName = 'argumentName';
      const resultOrError = GuardProps.againstIncorrectType(
        argument,
        argumentName,
        typeof 1,
      );
      expect(resultOrError.isFailure).toBe(true);
      expect(resultOrError.getError()).toMatchObject({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `Field *${argumentName}* is not of type ${typeof 1}`,
      });
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should returns successful result if argument matches desired type', () => {
      const argument = 'argument';
      const argumentName = 'argumentName';
      const resultOrError = GuardProps.againstIncorrectType(
        argument,
        argumentName,
        typeof argument,
      );
      expect(resultOrError.isSuccess).toBe(true);
      expect(resultOrError.getValue()).toBe(argument);
    });
  });
});
