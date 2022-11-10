import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';

export type ResultError = {
  code: CUSTOM_ERRORS;
  msg: string;
};

export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _error: ResultError;
  private readonly _value: T;

  public constructor(isSuccess: boolean, error?: ResultError, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._error = error;
    this._value = value;
  }

  public getValue(): T {
    if (this.isFailure) {
      throw new Error('cannot get value for failed result');
    }
    return this._value;
  }

  public getError(): ResultError {
    if (this.isSuccess) {
      throw new Error('cannot get error for successful result');
    }
    return this._error;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail(error: ResultError): Result<any> {
    return new Result(false, error, null);
  }

  public static combineResults(combinedResults: Result<any>[]): Result<any> {
    // return first error
    for (const result of combinedResults) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
