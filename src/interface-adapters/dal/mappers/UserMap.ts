import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { User } from '@domain/entities/User';
import { UserId } from '@domain/value-objects/user/UserId';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import { UserUsername } from '@domain/value-objects/user/UserUsername';
import { UserDto } from '@interface-adapters/dal/dtos/User.dto';

export class UserMap implements BaseMapper<User> {
  toDomain(raw: any): User {
    const id_or_error = UserId.create({ value: raw.id });
    const username_or_error = UserUsername.create({
      value: raw.username,
    });
    const password_or_error = UserPassword.create({
      value: raw.password,
    });
    const profile_color_or_error = UserProfileColor.create({
      value: raw.profile_color,
    });

    const combinedPropsResult = Result.combine([
      id_or_error,
      username_or_error,
      password_or_error,
      profile_color_or_error,
    ]);

    if (combinedPropsResult.isFailure) {
      console.log(combinedPropsResult.getError());
      return null;
    }

    const id = id_or_error.getValue();
    const username = username_or_error.getValue();
    const password = password_or_error.getValue();
    const profile_color = profile_color_or_error.getValue();

    const userOrError = User.create({
      id,
      username,
      password,
      profile_color,
    });

    if (userOrError.isFailure) {
      console.log(userOrError.getError());
    }
    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  toPersistence(user: User): any {
    const { username, password, profile_color } = user.props;
    return {
      username: username.value,
      password: password.value,
      profile_color: profile_color.value,
    };
  }

  toDTO(user: User): any {
    const { id, username, password, profile_color } = user.props;
    return UserDto.create({
      id: id.value,
      username: username.value,
      password: password.value,
      profile_color: profile_color.value,
    });
  }
}
