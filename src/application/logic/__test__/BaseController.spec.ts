import { BaseController } from '@application/logic/BaseController';
import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BaseController', () => {
  class TestController extends BaseController {}
  const testController = new TestController();
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should handle successful result with dto result by returning dto', () => {
    const dto = 'dto';
    const successfulResult = Result.ok(dto);

    expect(testController.handleResult(successfulResult)).toBe(dto);
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should handle successful result without dto by returning null', () => {
    const successfulResult = Result.ok();

    expect(testController.handleResult(successfulResult)).toBe(null);
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should throw http exception with bad request status when result is failure with user input error code', () => {
    const failedResult = Result.fail({
      code: CUSTOM_ERRORS.USER_INPUT_ERROR,
      msg: 'error',
    });

    const expectedError = new HttpException(
      `Bad user input: ${failedResult.getError().msg}`,
      HttpStatus.BAD_REQUEST,
    );

    expect(() => testController.handleResult(failedResult)).toThrowError(
      expectedError,
    );
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should throw http exception with unauthorized status when result is failure with authentication error code', () => {
    const failedResult = Result.fail({
      code: CUSTOM_ERRORS.AUTHENTICATION_ERROR,
      msg: 'error',
    });

    const expectedError = new HttpException(
      `Authentication error: ${failedResult.getError().msg}`,
      HttpStatus.UNAUTHORIZED,
    );

    expect(() => testController.handleResult(failedResult)).toThrowError(
      expectedError,
    );
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should throw http exception with internal server error status when result is failure with unknown error code', () => {
    const failedResult = Result.fail({
      code: null,
      msg: 'error',
    });

    const expectedError = new HttpException(
      `Internal server error: ${failedResult.getError().msg}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    expect(() => testController.handleResult(failedResult)).toThrowError(
      expectedError,
    );
  });
});
