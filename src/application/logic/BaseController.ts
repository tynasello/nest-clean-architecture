import { Result, ResultError } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class BaseController {
  public handleResult(result: Result<any>) {
    if (result.isFailure) {
      return this.error(result.getError());
    }
    return this.success(result.getValue());
  }

  private success(dto?: any) {
    return dto ? dto : null;
  }

  private error(resultError: ResultError) {
    const { code, msg } = resultError;

    switch (code) {
      case CUSTOM_ERRORS.USER_INPUT_ERROR:
        throw new HttpException(
          `Bad user input: ${msg}`,
          HttpStatus.BAD_REQUEST,
        );

      case CUSTOM_ERRORS.AUTHENTICATION_ERROR:
        throw new HttpException(
          `Authentication error: ${msg}`,
          HttpStatus.UNAUTHORIZED,
        );

      default:
        throw new HttpException(
          `Internal server error${msg ? `: ${msg}` : ''}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
