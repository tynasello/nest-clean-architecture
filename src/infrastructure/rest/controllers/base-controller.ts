import { HttpException, HttpStatus } from '@nestjs/common';
import { ResultError } from '../../../application/logic/result';
import { CUSTOM_ERRORS } from '../../../domain/errors/custom-errors';

export abstract class BaseController {
  public handleFailedResult(resultError: ResultError) {
    console.log(resultError);

    const { code, message } = resultError;

    switch (code) {
      case CUSTOM_ERRORS.USER_INPUT_ERROR:
        throw new HttpException(
          `Bad user input${message ? `: ${message}` : '.'}`,
          HttpStatus.BAD_REQUEST,
        );

      case CUSTOM_ERRORS.AUTHENTICATION_ERROR:
        throw new HttpException(
          `Authentication error${message ? `: ${message}` : '.'}`,
          HttpStatus.UNAUTHORIZED,
        );

      case CUSTOM_ERRORS.INTERNAL_SERVER_ERROR:
        throw new HttpException(
          `Internal server error error${message ? `: ${message}` : '.'}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      default:
        throw new HttpException(
          `Internal server error${message ? `: ${message}` : '.'}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
