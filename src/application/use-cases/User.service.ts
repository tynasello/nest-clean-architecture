import { SignupUserDto } from '@application/contracts/dtos/user/SignupUser.dto';
import { UpdateUserDto } from '@application/contracts/dtos/user/UpdateUser.dto';
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

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async getUsers(): Promise<Result<User[]>> {
    const collectedUsers = await this.userRepository.getAll();
    return Result.ok(collectedUsers);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async getUserByUsername(username: string): Promise<Result<User>> {
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

  async createUser(createUserDto: SignupUserDto): Promise<Result<User>> {
    const userExists = await this.userRepository.exists({
      username: createUserDto.username,
    });
    if (userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'User already exists',
      });

    const userOrError = this.userMap.dtoToDomain(createUserDto);
    if (userOrError.isFailure) {
      return Result.fail(userOrError.getError());
    }

    const user = userOrError.getValue();

    const createdUser = await this.userRepository.create(user);

    return Result.ok<User>(createdUser);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  public async updateUser(updateUserDto: UpdateUserDto): Promise<Result<User>> {
    const { username } = updateUserDto;

    const userExists = await this.userRepository.exists({
      username: username,
    });

    if (!userExists)
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        msg: 'User does not exist',
      });

    const updatedUser = await this.userRepository.update(updateUserDto);

    return Result.ok<User>(updatedUser);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
}
