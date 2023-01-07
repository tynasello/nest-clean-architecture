import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { GetUserUseCase } from '../../../application/use-cases/get-user-use-case';
import { UseCaseProxy } from '../../use-cases-proxy/use-cases-proxy';
import { UseCaseProxyModule } from '../../use-cases-proxy/use-cases-proxy.module';
import { GetUserFromReq } from '../decorators/get-user-from-req.decorator';
import { GetUserResponseDto } from '../dtos/user/get-user-response.dto';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { BaseController } from './base-controller';

@Controller('user')
export class UserController extends BaseController {
  constructor(
    @Inject(UseCaseProxyModule.GET_USER_USE_CASE_PROXY)
    private readonly getUserUseCaseProxy: UseCaseProxy<GetUserUseCase>,
  ) {
    super();
  }

  @Get('get-user')
  @UseGuards(AccessTokenGuard)
  public async getUser(
    @GetUserFromReq('username') username: string,
  ): Promise<GetUserResponseDto> {
    const existingUserOrError = await this.getUserUseCaseProxy
      .getInstance()
      .getUser(username);
    if (existingUserOrError.isFailure) {
      this.handleFailedResult(existingUserOrError.getError());
    }
    const existingUser = existingUserOrError.getValue();
    const getUserResponseDto = new GetUserResponseDto(existingUser);
    return getUserResponseDto;
  }
}
