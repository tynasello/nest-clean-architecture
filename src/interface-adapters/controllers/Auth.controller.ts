import { AuthTokensDto } from '@application/contracts/dtos/user-auth/AuthTokens.dto';
import { LoginUserDto } from '@application/contracts/dtos/user-auth/LoginUser.dto';
import { SignupUserDto } from '@application/contracts/dtos/user-auth/SignupUser.dto';
import { BaseController } from '@application/logic/BaseController';
import { BaseMapper } from '@application/logic/BaseMapper';
import { Result } from '@application/logic/Result';
import { AuthService } from '@application/use-cases/Auth.service';
import { User } from '@domain/aggregates/User';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { GetUserFromReq } from './decorators/GetUserFromReq.decorator';
import { AccessTokenGuard } from './guards/AccessToken.guard';
import { RefreshTokenGuard } from './guards/RefeshToken.guard';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    @Inject('BaseMapper<User>') private userMap: BaseMapper<User>,
  ) {
    super();
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    const authTokensOrError = await this.authService.login(loginUserDto);
    const authTokensDtoOrError = authTokensOrError.isSuccess
      ? Result.ok(AuthTokensDto.create(authTokensOrError.getValue()))
      : Result.fail(authTokensOrError.getError());
    return this.handleResult(authTokensDtoOrError);
  }

  @Post('signup')
  public async signup(@Body() signupUserDto: SignupUserDto): Promise<any> {
    const authTokensOrError = await this.authService.signup(signupUserDto);
    const authTokensDtoOrError = authTokensOrError.isSuccess
      ? Result.ok(AuthTokensDto.create(authTokensOrError.getValue()))
      : Result.fail(authTokensOrError.getError());
    return this.handleResult(authTokensDtoOrError);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  public async logout(
    @GetUserFromReq('username') username: string,
  ): Promise<any> {
    const result = await this.authService.logout(username);
    return this.handleResult(result);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-tokens')
  public async refreshTokens(
    @GetUserFromReq('username') username: string,
    @GetUserFromReq('refreshToken') refreshToken: string,
  ): Promise<any> {
    const refreshedAccessTokenOrError = await this.authService.refreshTokens({
      username,
      refreshToken,
    });
    return this.handleResult(refreshedAccessTokenOrError);
  }
}
