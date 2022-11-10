import { Result } from '@application/logic/Result';
import { AggregateRoot } from '@domain/primitives/AggregateRoot';
import { Id } from '@domain/value-objects/Id';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import { UserUsername } from '@domain/value-objects/user/UserUsername';

type UserProps = {
  id: Id;
  username: UserUsername;
  password: UserPassword;
  refreshToken: string;
  profileColor: UserProfileColor;
};

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  public static create(props: Partial<UserProps>): Result<User> {
    const { id, username, password, refreshToken, profileColor } = props;

    const user = new User({
      id,
      username,
      password,
      refreshToken,
      profileColor,
    });

    return Result.ok<User>(user);
  }
}
