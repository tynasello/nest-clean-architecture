import { UserDto } from '@application/contracts/dtos/user-auth/User.dto';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Guard } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';
import { User } from '@domain/aggregates/User';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import { UserUsername } from '@domain/value-objects/user/UserUsername';

export class UserMap implements BaseMapper<User> {
  toDomain(raw: any): User {
    const { id, refreshToken } = raw;
    const idOrError = Guard.againstNullOrUndefined(id, 'id');

    const usernameOrError = UserUsername.create({
      value: raw.username,
    });
    const passwordOrError = UserPassword.create({
      value: raw.password,
    });
    const profileColorOrError = UserProfileColor.create({
      value: raw.profileColor,
    });

    const combinedPropsResult = Result.combine([
      idOrError,
      usernameOrError,
      passwordOrError,
      profileColorOrError,
    ]);

    if (combinedPropsResult.isFailure) {
      console.log(combinedPropsResult.getError());
      return null;
    }

    const username = usernameOrError.getValue();
    const password = passwordOrError.getValue();
    const profileColor = profileColorOrError.getValue();

    const userOrError = User.create({
      id,
      username,
      password,
      refreshToken,
      profileColor,
    });

    if (userOrError.isFailure) {
      userOrError.getError();
    }
    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  toPersistence(user: User): any {
    const { username, password, profileColor } = user.props;
    return {
      username: username.value,
      password: password.value,
      refreshToken: '',
      profileColor: profileColor.value,
    };
  }

  toDTO(user: User): any {
    const { id, username, password, refreshToken, profileColor } = user.props;

    return UserDto.create({
      id: id,
      username: username.value,
      password: password.value,
      refreshToken: refreshToken,
      profileColor: profileColor.value,
    });
  }
}
