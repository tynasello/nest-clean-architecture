import { SignupUserDto } from '@application/contracts/dtos/user/SignupUser.dto';
import { UpdateUserDto } from '@application/contracts/dtos/user/UpdateUser.dto';
import { Guard } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/CustomErrors';
import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/interfaces/IUserRepository';
import { UserUsername } from '@domain/value-objects/user/UserUsername';
import { UserMap } from '@interface-adapters/dal/mappers/UserMap';
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
    const userOrError = UserMap.dtoToDomain(createUserDto);

    if (userOrError.isFailure) {
      return Result.fail(userOrError.getError());
    }

    // user entity created...
    let user = userOrError.getValue();

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
