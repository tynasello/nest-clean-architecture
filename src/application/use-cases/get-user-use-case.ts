import { User } from '../../domain/entities/user';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { Result } from '../logic/result';

export class GetUserUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  public async getUser(username: string): Promise<Result<User>> {
    const existingUserOrError = await this._userRepository.getUserByUsername(
      username,
    );
    if (existingUserOrError.isFailure) {
      return Result.fail(existingUserOrError.getError());
    }
    const existingUser = existingUserOrError.getValue();
    return Result.ok<User>(existingUser);
  }
}
