import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';

describe('Result', () => {
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('fail', () => {
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should fail to get value when result is error', () => {
      const result = Result.fail({
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        msg: 'Error',
      });
      expect(result.isFailure).toBe(true);
      expect(() => result.getValue()).toThrowError;
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should get error when result is failure', () => {
      const error = {
        code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
        msg: 'Error',
      };
      const result = Result.fail(error);
      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe(error);
    });
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  describe('ok', () => {
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should fail to get error when result is success', () => {
      const result = Result.ok();
      expect(result.isSuccess).toBe(true);
      expect(() => result.getError()).toThrowError;
    });

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    it('should get value when result is success', () => {
      const value = 'value';
      const result = Result.ok(value);
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBe(value);
    });
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should combine successful results', () => {
    const successfulResult1 = Result.ok();
    const successfulResult2 = Result.ok();
    const combinedResults = [successfulResult1, successfulResult2];
    expect(Result.combineResults(combinedResults).isSuccess).toBe(true);
  });

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  it('should throw error when combine results with at least one is a failure', () => {
    const error = {
      code: CUSTOM_ERRORS.INTERNAL_SERVER_ERROR,
      msg: 'Error',
    };
    const successfulResult = Result.ok();
    const failedResult = Result.fail(error);
    const combinedResults = [successfulResult, failedResult];
    expect(Result.combineResults(combinedResults).isFailure).toBe(true);
  });
});
