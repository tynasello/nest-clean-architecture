import { LoginUserDto } from '@application/contracts/dtos/user/LoginUser.dto';
import { SignupUserDto } from '@application/contracts/dtos/user/SignupUser.dto';
import { BaseController } from '@application/logic/BaseController';
import { AuthService } from '@application/use-cases/Auth.service';
import { GetUserFromReq } from '@interface-adapters/controllers/decorators/GetUserFromReq.decorator';
import { AccessTokenGuard } from '@interface-adapters/controllers/guards/AccessToken.guard';
import { RefreshTokenGuard } from '@interface-adapters/controllers/guards/RefeshToken.guard';
import { SetCookiesInterceptor } from '@interface-adapters/controllers/interceptors/SetCookies.interceptor';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  @Post('login')
  @UseInterceptors(SetCookiesInterceptor)
  public async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    const authTokensDtoOrError = await this.authService.login(loginUserDto);
    return this.handleResult(authTokensDtoOrError);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  @Post('signup')
  @UseInterceptors(SetCookiesInterceptor)
  public async signup(@Body() signupUserDto: SignupUserDto): Promise<any> {
    const authTokensDtoOrError = await this.authService.signup(signupUserDto);
    return this.handleResult(authTokensDtoOrError);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  @Post('logout')
  @UseInterceptors(SetCookiesInterceptor)
  @UseGuards(AccessTokenGuard)
  public async logout(
    @GetUserFromReq('username') username: string,
  ): Promise<any> {
    const loggedOutResult = await this.authService.logout(username);
    return this.handleResult(loggedOutResult);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  @Post('refresh-tokens')
  @UseInterceptors(SetCookiesInterceptor)
  @UseGuards(RefreshTokenGuard)
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
