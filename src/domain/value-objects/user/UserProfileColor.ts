import { Result } from '@application/logic/Result';
import { ValueObject } from '@domain/primitives/ValueObject';

type UserProfileColorValue = string;

export class UserProfileColor extends ValueObject<UserProfileColorValue> {
  private static readonly defaultUserProfileColor = 'gray';
  private static readonly validProfileColors = [
    'gray',
    'blue',
    'red',
    'orange',
    'yellow',
    'green',
    'purple',
  ];

  public static isValidProfileColor(profileColor: string): boolean {
    if (UserProfileColor.validProfileColors.includes(profileColor)) return true;
    return false;
  }

  public static create(
    value?: UserProfileColorValue,
  ): Result<UserProfileColor> {
    value = value ? value.toLowerCase() : null;
    return Result.ok<UserProfileColor>(
      new UserProfileColor(
        this.isValidProfileColor(value)
          ? value
          : UserProfileColor.defaultUserProfileColor,
      ),
    );
  }
}
