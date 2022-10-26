import { Result } from '@application/logic/Result';
import { AggregateRoot } from '@domain/AggregateRoot';
import { UniqueEntityId } from '@domain/UniqueEntityId';
import { UserId } from '@domain/value-objects/user/UserId';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import { UserUsername } from '@domain/value-objects/user/UserUsername';

interface UserProps {
  id?: UserId;
  username: UserUsername;
  password: UserPassword;
  profile_color?: UserProfileColor;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public static create(
    props: UserProps,
    entityId?: UniqueEntityId,
  ): Result<User> {
    const { id, username, password, profile_color } = props;

    const user = new User(
      {
        id,
        username,
        password,
        profile_color,
      },
      entityId,
    );

    return Result.ok<User>(user);
  }
}
