import { SignupUserRequestDto } from '@application/contracts/dtos/user/SignupUser.request.dto';
import { UpdateUserRequestDto } from '@application/contracts/dtos/user/UpdateUser.request.dto';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { User } from '@domain/entities/User';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { IUserRepository } from '@domain/interfaces/repositories/IUserRepository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('BaseMapper<User>') private readonly userMap: BaseMapper<User>,
  ) {}

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  async getUsers(): Promise<Result<User[]>> {
    const collectedUsers = await this.userRepository.getAllUsers();
    return Result.ok(collectedUsers);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  async getUserById(id: string): Promise<Result<User>> {
    const userExists = await this.userRepository.userExists({
      id,
    });

    if (!userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `User with id ${id} does not exist`,
      });

    const collectedUser = await this.userRepository.getUserByIdentifier({
      id,
    });

    return Result.ok<User>(collectedUser);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  async getUserByUsername(username: string): Promise<Result<User>> {
    const userExists = await this.userRepository.userExists({
      username,
    });

    if (!userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: `User with username ${username} does not exist`,
      });

    const collectedUser = await this.userRepository.getUserByIdentifier({
      username,
    });

    return Result.ok<User>(collectedUser);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  async createUser(createUserDto: SignupUserRequestDto): Promise<Result<User>> {
    const userExists = await this.userRepository.userExists({
      username: createUserDto.username,
    });
    if (userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'User already exists',
      });

    const userOrError = await this.userMap.dtoToDomain(createUserDto);
    if (userOrError.isFailure) {
      return Result.fail(userOrError.getError());
    }

    const user = userOrError.getValue();

    const createdUser = await this.userRepository.create(user);

    return Result.ok<User>(createdUser);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async updateUser(
    updateUserDto: UpdateUserRequestDto,
  ): Promise<Result<User>> {
    const { username } = updateUserDto;

    const userExists = await this.userRepository.userExists({
      username: username,
    });

    if (!userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'User does not exist',
      });

    const updatedUser = await this.userRepository.updateUser(updateUserDto);

    return Result.ok<User>(updatedUser);
  }
}
