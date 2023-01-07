import { CUSTOM_ERRORS } from '../../domain/errors/custom-errors';

export type ResultError = {
  code: CUSTOM_ERRORS;
  message: string;
};

export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _error: ResultError;
  private readonly _value: T;

  public constructor(isSuccess: boolean, value?: T, error?: ResultError) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._error = error;
    this._value = value;
  }

  public getValue(): T {
    if (this.isFailure) {
      throw new Error('Cannot get value for a failed result.');
    }
    return this._value;
  }

  public getError(): ResultError {
    if (this.isSuccess) {
      throw new Error('Cannot get error for a successful result.');
    }
    return this._error;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, value, null);
  }

  public static fail(error: ResultError): Result<any> {
    return new Result(false, null, error);
  }

  public static combineResults(combinedResults: Result<any>[]): Result<any> {
    // return first error
    for (const result of combinedResults) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
