import { UpdateUserRequestDto } from '@application/contracts/dtos/user/UpdateUser.request.dto';
import { User } from '@domain/entities/User';
import { IRepository } from '@domain/interfaces/IRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserRepository extends IRepository<User> {
  userExists(identifiers: any): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUserByIdentifier(identifiers: any): Promise<User>;
  updateUser(updateUserDto: UpdateUserRequestDto): Promise<User>;
}
