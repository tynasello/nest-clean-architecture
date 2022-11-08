import { BaseController } from '@application/logic/BaseController';
import { Result } from '@application/logic/Result';
import { UserService } from '@application/use-cases/User.service';
import { AccessTokenGuard } from '@interface-adapters/controllers/guards/AccessToken.guard';
import { UserMap } from '@interface-adapters/dal/mappers/UserMap';
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUserFromReq } from './decorators/GetUserFromReq.decorator';
import { CachingInterceptor } from './interceptors/Caching.interceptor';

@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @UseInterceptors(CachingInterceptor)
  @UseGuards(AccessTokenGuard)
  @Get('byUsername')
  public async getUserByUsername(
    @GetUserFromReq('username') username: string,
  ): Promise<any> {
    const userOrError = await this.userService.getUserByUsername(username);
    const userDtoOrError = userOrError.isSuccess
      ? Result.ok(UserMap.toDTO(userOrError.getValue()))
      : Result.fail(userOrError.getError());
    return this.handleResult(userDtoOrError);
  }
}
