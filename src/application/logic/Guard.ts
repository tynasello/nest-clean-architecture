import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/CustomErrors';

export class Guard {
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
      return Result.ok();
    }
  }
}
