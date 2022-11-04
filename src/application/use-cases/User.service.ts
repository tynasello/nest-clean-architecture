import { SignupUserDto } from '@application/contracts/dtos/user-auth/SignupUser.dto';
import { UpdateUserDto } from '@application/contracts/dtos/user-auth/UpdateUser.dto';
import { Guard } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';
import { User } from '@domain/aggregates/User';
import { CUSTOM_ERRORS } from '@domain/CustomErrors';
import { IUserRepository } from '@domain/interfaces/IUserRepository';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import { UserUsername } from '@domain/value-objects/user/UserUsername';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async getUsers(): Promise<Result<any[]>> {
    const collectedUsers = await this.userRepository.getAll();
    return Result.ok<User[]>(collectedUsers);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async getUserByUsername(username: string): Promise<Result<any>> {
    const userExists = await this.userRepository.exists({
      username,
    });

    if (!userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `User with username ${username} does not exist`,
      });

    const collectedUser = await this.userRepository.getOneByIdentifier({
      username,
    });

    return Result.ok<User>(collectedUser);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async createUser(createUserDto: SignupUserDto): Promise<Result<any>> {
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

    const username = usernameOrError.getValue();
    const password = passwordOrError.getValue();
    const profileColor = profileColorOrError.getValue();

    const userOrError = User.create({
      username,
      password,
      profileColor,
    });

    if (userOrError.isFailure) {
      const error = userOrError.getError();
      return Result.fail(error);
    }

    // user entity created...
    let user = userOrError.getValue() as User;

    // check unique username constraint met
    const userExists = await this.userRepository.exists({
      username: user.props.username.value,
    });
    if (userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'User already exists',
      });

    // save user
    user = await this.userRepository.create(user);

    return Result.ok<User>(user);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  public async updateUserRefreshToken(
    updateUserDto: UpdateUserDto,
  ): Promise<Result<any>> {
    const { refreshToken } = updateUserDto;
    const usernameOrError = UserUsername.create({
      value: updateUserDto.username,
    });
    const refreshTokenOrError = Guard.againstNullOrUndefined(
      refreshToken,
      'refreshToken',
    );

    const combinedPropsResult = Result.combine([
      usernameOrError,
      refreshTokenOrError,
    ]);

    if (combinedPropsResult.isFailure) {
      return Result.fail(combinedPropsResult.getError());
    }

    const username = usernameOrError.getValue();

    const userExists = await this.userRepository.exists({
      username: username.value,
    });
    if (!userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'User does not exist',
      });

    const updatedUser = await this.userRepository.updateUser(username.value, {
      refreshToken: refreshToken,
    });

    return Result.ok<User>(updatedUser);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
}
