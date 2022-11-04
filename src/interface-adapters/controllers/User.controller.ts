import { BaseController } from '@application/logic/BaseController';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { UserService } from '@application/use-cases/User.service';
import { User } from '@domain/aggregates/User';
import { AccessTokenGuard } from '@interface-adapters/controllers/guards/AccessToken.guard';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { GetUserFromReq } from './decorators/GetUserFromReq.decorator';

@Controller('user')
export class UserController extends BaseController {
  constructor(
    private readonly userService: UserService,
    @Inject('BaseMapper<User>') private userMap: BaseMapper<User>,
  ) {
    super();
  }

  @UseGuards(AccessTokenGuard)
  @Get('byUsername')
  public async getUserByUsername(
    @GetUserFromReq('username') username: string,
  ): Promise<any> {
    const userOrError = await this.userService.getUserByUsername(username);
    const userDtoOrError = userOrError.isSuccess
      ? Result.ok(this.userMap.toDTO(userOrError.getValue()))
      : Result.fail(userOrError.getError());
    return this.handleResult(userDtoOrError);
  }
}
