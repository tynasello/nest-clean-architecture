import { Result } from '@application/logic/Result';

interface UserProfileColorProps {
  value?: string;
}

export class UserProfileColor {
  public readonly value: string;

  private constructor(props: UserProfileColorProps) {
    this.value = props.value;
  }

  public static isValidProfileColor(profileColor: string): boolean {
    if (profileColor === 'blue' || profileColor === 'red') {
      return true;
    }
    return false;
  }

  public static create(props: UserProfileColorProps): Result<UserProfileColor> {
    const { value } = props;

    const userProfileColor = new UserProfileColor({
      value: this.isValidProfileColor(value) ? value : 'gray',
    });

    return Result.ok<UserProfileColor>(userProfileColor);
  }
}
