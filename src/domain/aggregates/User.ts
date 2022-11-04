import { Result } from '@application/logic/Result';
import { AggregateRoot } from '@domain/AggregateRoot';
import { UserCreatedEvent } from '@domain/events/UserCreatedEvent';
import { UniqueEntityId } from '@domain/UniqueEntityId';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import { UserUsername } from '@domain/value-objects/user/UserUsername';

interface UserProps {
  id?: string;
  username: UserUsername;
  password: UserPassword;
  refreshToken?: string;
  profileColor?: UserProfileColor;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public static create(
    props: UserProps,
    entityId?: UniqueEntityId,
  ): Result<User> {
    const { id, username, password, refreshToken, profileColor } = props;

    const user = new User(
      {
        id,
        username,
        password,
        refreshToken,
        profileColor,
      },
      entityId,
    );

    user.addDomainEvent(new UserCreatedEvent());

    return Result.ok<User>(user);
  }
}
