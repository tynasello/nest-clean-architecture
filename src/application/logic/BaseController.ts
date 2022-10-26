import { Result, ResultError } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/CustomErrors';
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';

export abstract class BaseController {
  public handleResult(result: Result<any>) {
    if (result.isFailure) {
      return this.error(result.getError());
    }
    return this.success(result.getValue());
  }

  public success(dto?: any) {
    return dto;
  }

  public error(resultError: ResultError) {
    const { code, msg } = resultError;
    switch (code) {
      case CUSTOM_ERRORS.USER_INPUT_ERROR:
        return new UserInputError(`Bad user input: ${msg}`);
      case CUSTOM_ERRORS.AUTHENTICATION_ERROR:
        return new AuthenticationError(`Authentication error: ${msg}`);
      case CUSTOM_ERRORS.FORBIDDEN_ERROR:
        return new ForbiddenError(`Forbidden error: ${msg}`);
      case CUSTOM_ERRORS.INTERNAL_SERVER_ERROR:
        return new Error(`Internal server error: ${msg}`);
      default:
        return new Error(`Internal server error: ${msg}`);
    }
  }

  public fail(error: any) {
    return error;
  }
}
