import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';

export class GuardProps {
  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): Result<any> {
    if (argument === null || argument === undefined) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `Field *${argumentName}* is null or undefined`,
      });
    } else {
      return Result.ok(argument);
    }
  }
  public static againstIncorrectType(
    argument: any,
    argumentName: string,
    requiredType: any,
  ): Result<any> {
    if (typeof argument !== requiredType) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `Field *${argumentName}* is not of type ${requiredType}`,
      });
    } else {
      return Result.ok(argument);
    }
  }
}
