import { BaseController } from '@application/logic/BaseController';
import { UserService } from '@application/use-cases/User.service';
import { User } from '@domain/entities/User';
import { CreateUserDto } from '@interface-adapters/dal/dtos/CreateUser.dto';
import { UserDto } from '@interface-adapters/dal/dtos/User.dto';
import { CachingInterceptor } from '@interface-adapters/interceptors/Caching.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

@UseInterceptors(CachingInterceptor)
@Resolver(() => User)
export class UserController extends BaseController {
  private readonly _pubSub: any;

  constructor(private readonly userService: UserService) {
    super();
    this._pubSub = new PubSub();
  }

  @Query(() => [UserDto])
  public async getUsers(): Promise<any> {
    const result = await this.userService.getUsers();
    return this.handleResult(result);
  }

  @Query(() => UserDto)
  public async getUserById(
    @Args({ name: 'userId' }) userId: string,
  ): Promise<any> {
    const result = await this.userService.getUserById(userId);
    return this.handleResult(result);
  }

  @Mutation(() => UserDto)
  public async createUser(
    @Args({ name: 'createUserDto' }) createUserDto: CreateUserDto,
  ): Promise<any> {
    const result = await this.userService.createUser(createUserDto);

    if (result.isSuccess) {
      this._pubSub.publish('listenForUserAdded', {
        listenForUserAdded: result.getValue(),
      });
    }
    return this.handleResult(result);
  }

  @Subscription(() => UserDto)
  public listenForUserAdded() {
    return this._pubSub.asyncIterator('listenForUserAdded');
  }
}
