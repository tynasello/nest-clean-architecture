import { SignupUserRequestDto } from '@application/contracts/dtos/user/SignupUser.request.dto';
import { UserResponseDto } from '@application/contracts/dtos/user/User.response.dto';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { User } from '@domain/entities/User';
import { Id } from '@domain/value-objects/Id';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import { UserUsername } from '@domain/value-objects/user/UserUsername';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMap implements BaseMapper<User> {
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  public persistanceToDomain(raw: any): User | null {
    const { id, username, password, refreshToken, profileColor } = raw;
    const userOrError = User.create({
      id: { value: id },
      username: { value: username },
      password: { value: password },
      refreshToken,
      profileColor: { value: profileColor },
    });
    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  public dtoToDomain(createUserDto: SignupUserRequestDto): Result<User> {
    const idOrError = Id.create();
    const usernameOrError = UserUsername.create(createUserDto.username);
    const passwordOrError = UserPassword.create(createUserDto.password);
    const profileColorOrError = UserProfileColor.create(
      createUserDto.profileColor,
    );

    const combinedPropsResult = Result.combineResults([
      idOrError,
      usernameOrError,
      passwordOrError,
      profileColorOrError,
    ]);

    if (combinedPropsResult.isFailure) {
      return Result.fail(combinedPropsResult.getError());
    }

    const id = idOrError.getValue();
    const username = usernameOrError.getValue();
    const password = passwordOrError.getValue();

    const profileColor = profileColorOrError.getValue();

    const userOrError = User.create({
      id,
      username,
      password,
      profileColor,
    });

    if (userOrError.isFailure) {
      Result.fail(userOrError.getError());
    }

    const user = userOrError.getValue();

    return Result.ok(user);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  public domainToPersistence(user: User): any {
    const { id, username, password, refreshToken, profileColor } = user.props;
    return {
      id: id.value,
      username: username.value,
      password: password.value,
      refreshToken: refreshToken,
      profileColor: profileColor.value,
    };
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  public domainToDTO(user: User): UserResponseDto {
    const { id, username, profileColor } = user.props;

    const userDto = UserResponseDto.create({
      id: id.value,
      username: username.value,
      profileColor: profileColor.value,
    });
    return userDto;
  }
}
