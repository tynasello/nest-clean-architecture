import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { User } from '@domain/aggregates/User';
import { CUSTOM_ERRORS } from '@domain/CustomErrors';
import { IUserRepository } from '@domain/interfaces/IUserRepository';
import { UserId } from '@domain/value-objects/user/UserId';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { UserProfileColor } from '@domain/value-objects/user/UserProfileColor';
import { UserUsername } from '@domain/value-objects/user/UserUsername';
import { CreateUserDto } from '@interface-adapters/dal/dtos/CreateUser.dto';
import { UserDto } from '@interface-adapters/dal/dtos/User.dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('BaseMapper<User>') private userMap: BaseMapper<User>,
    @Inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async getUsers(): Promise<Result<any[]>> {
    const collectedUsers = await this.userRepository.getAll();
    const userDtos = collectedUsers.map((user) => this.userMap.toDTO(user));
    return Result.ok<UserDto[]>(userDtos);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async getUserById(userId: string): Promise<Result<any>> {
    const id_or_error = UserId.create({ value: userId });
    if (id_or_error.isFailure) {
      return Result.fail(id_or_error.getError());
    }

    const userExists = await this.userRepository.exists({
      id: userId,
    });

    if (!userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `User with id ${userId} does not exist`,
      });

    const collectedUser = await this.userRepository.getOneById(userId);
    const userDto = this.userMap.toDTO(collectedUser);
    return Result.ok<UserDto>(userDto);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async createUser(createUserDto: CreateUserDto): Promise<Result<any>> {
    const username_or_error = UserUsername.create({
      value: createUserDto.username,
    });
    const password_or_error = UserPassword.create({
      value: createUserDto.password,
    });
    const profile_color_or_error = UserProfileColor.create({
      value: createUserDto.profile_color,
    });

    const combinedPropsResult = Result.combine([
      username_or_error,
      password_or_error,
      profile_color_or_error,
    ]);

    if (combinedPropsResult.isFailure) {
      return Result.fail(combinedPropsResult.getError());
    }

    const username = username_or_error.getValue();
    const password = password_or_error.getValue();
    const profile_color = profile_color_or_error.getValue();

    const user_or_error = User.create({
      username,
      password,
      profile_color,
    });

    if (user_or_error.isFailure) {
      const error = user_or_error.getError();
      return Result.fail(error);
    }

    // user entity created...
    let user: User = user_or_error.getValue();

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
    const userDto = this.userMap.toDTO(user);
    return Result.ok<UserDto>(userDto);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
}
