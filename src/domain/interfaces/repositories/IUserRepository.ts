import { UpdateUserDto } from '@application/contracts/dtos/user/UpdateUser.dto';
import { User } from '@domain/entities/User';
import { IRepository } from '@domain/interfaces/IRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserRepository extends IRepository<User> {
  // add additional methods unique to user
  update(updateUserDto: UpdateUserDto): Promise<User>;
}
