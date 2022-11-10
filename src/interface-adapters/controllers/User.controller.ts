import { BaseController } from '@application/logic/BaseController';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { UserService } from '@application/use-cases/User.service';
import { User } from '@domain/entities/User';
import { GetUserFromReq } from '@interface-adapters/controllers/decorators/GetUserFromReq.decorator';
import { AccessTokenGuard } from '@interface-adapters/controllers/guards/AccessToken.guard';
import { CachingInterceptor } from '@interface-adapters/controllers/interceptors/Caching.interceptor';
import {
  Controller,
  Get,
  Inject,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@Controller('user')
export class UserController extends BaseController {
  constructor(
    private readonly userService: UserService,
    @Inject('BaseMapper<User>') private readonly userMap: BaseMapper<User>,
  ) {
    super();
  }

  @Get()
  @UseInterceptors(CachingInterceptor)
  @UseGuards(AccessTokenGuard)
  public async getUser(
    @GetUserFromReq('username') username: string,
  ): Promise<any> {
    const userOrError = await this.userService.getUserByUsername(username);
    const userDtoOrError = userOrError.isSuccess
      ? Result.ok(this.userMap.domainToDTO(userOrError.getValue()))
      : Result.fail(userOrError.getError());
    return this.handleResult(userDtoOrError);
  }
}
