import { CUSTOM_ERRORS } from '@domain/CustomErrors';

export type ResultError = {
  code: CUSTOM_ERRORS;
  msg: string;
};

export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private error: ResultError;
  private _value: T;

  public constructor(isSuccess: boolean, error?: ResultError, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    return this._value;
  }

  public getError(): ResultError {
    return this.error;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail(error: ResultError): Result<any> {
    return new Result(false, error, null);
  }

  public static combine(combinedResults: Result<any>[]): Result<any> {
    // return first error
    for (const result of combinedResults) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
