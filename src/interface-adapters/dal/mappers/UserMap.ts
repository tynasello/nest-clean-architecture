import { SignupUserDto } from '@application/contracts/dtos/user/SignupUser.dto';
import { UserDto } from '@application/contracts/dtos/user/User.dto';
import { Result } from '@application/logic/Result';
import { User } from '@domain/entities/User';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import { UserUsername } from '@domain/value-objects/user/UserUsername';
import { IdService } from '@interface-adapters/services/Id.service';

export class UserMap {
  public static persistanceToDomain(raw: any): User | null {
    const userOrError = User.create({
      id: raw.id,
      username: { value: raw.username },
      password: { value: raw.password },
      refreshToken: raw.refreshToken,
      profileColor: { value: raw.profileColor },
    });

    return userOrError.isFailure ? null : userOrError.getValue();
  }

  public static dtoToDomain(createUserDto: SignupUserDto): Result<User> {
    const usernameOrError = UserUsername.create({
      value: createUserDto.username,
    });
    const passwordOrError = UserPassword.create({
      value: createUserDto.password,
    });
    const profileColorOrError = UserProfileColor.create({
      value: createUserDto.profileColor,
    });

    const combinedPropsResult = Result.combine([
      usernameOrError,
      passwordOrError,
      profileColorOrError,
    ]);

    if (combinedPropsResult.isFailure) {
      return Result.fail(combinedPropsResult.getError());
    }

    const id = IdService.newId();
    const username = usernameOrError.getValue();
    const password = passwordOrError.getValue();
    const refreshToken = null;
    const profileColor = profileColorOrError.getValue();

    const userOrError = User.create({
      id,
      username,
      password,
      refreshToken,
      profileColor,
    });

    if (userOrError.isFailure) {
      Result.fail(userOrError.getError());
    }

    const user = userOrError.getValue();

    return Result.ok(user);
  }

  public static toPersistence(user: User): any {
    const { id, username, password, refreshToken, profileColor } = user.props;
    return {
      id: id,
      username: username.value,
      password: password.value,
      refreshToken: refreshToken,
      profileColor: profileColor.value,
    };
  }

  public static toDTO(user: User): UserDto {
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
