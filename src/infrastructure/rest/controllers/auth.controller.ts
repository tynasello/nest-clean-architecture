import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserAuthUseCase } from '../../../application/use-cases/user-auth-use-case';
import { User } from '../../../domain/entities/user';
import { UseCaseProxy } from '../../use-cases-proxy/use-cases-proxy';
import { UseCaseProxyModule } from '../../use-cases-proxy/use-cases-proxy.module';
import { GetUserFromReq } from '../decorators/get-user-from-req.decorator';
import { LoginUserRequestDto } from '../dtos/auth/login-user-request.dto';
import { LoginUserResponseDto } from '../dtos/auth/login-user.response.dto';
import { SignupUserRequestDto } from '../dtos/auth/signup-user-request.dto';
import { SignupUserResponseDto } from '../dtos/auth/signup-user-response.dto';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { SetCookiesInterceptor } from '../interceptors/set-cookies.interceptor';
import { BaseController } from './base-controller';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    @Inject(UseCaseProxyModule.USER_AUTH_USE_CASE_PROXY)
    private readonly _userAuthUseCaseProxy: UseCaseProxy<UserAuthUseCase>,
  ) {
    super();
  }

  @Post('signup-user')
  @UseInterceptors(SetCookiesInterceptor)
  public async signupUser(
    @Body() signupUserDto: SignupUserRequestDto,
  ): Promise<SignupUserResponseDto> {
    const user = new User({
      username: signupUserDto.username,
      password: signupUserDto.password,
    });
    const createdAuthTokensOrError = await this._userAuthUseCaseProxy
      .getInstance()
      .signupUser(user);
    if (createdAuthTokensOrError.isFailure) {
      this.handleFailedResult(createdAuthTokensOrError.getError());
    }
    const createdAuthTokens = createdAuthTokensOrError.getValue();
    const signupUserResponseDto = new SignupUserResponseDto(createdAuthTokens);
    return signupUserResponseDto;
  }

  @Post('login-user')
  @UseInterceptors(SetCookiesInterceptor)
  public async loginUser(
    @Body() loginUserDto: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    const user = new User({
      username: loginUserDto.username,
      password: loginUserDto.password,
    });
    const createdAuthTokensOrError = await this._userAuthUseCaseProxy
      .getInstance()
      .loginUser(user);
    if (createdAuthTokensOrError.isFailure) {
      this.handleFailedResult(createdAuthTokensOrError.getError());
    }
    const createdAuthTokens = createdAuthTokensOrError.getValue();
    const loginUserResponseDto = new LoginUserResponseDto(createdAuthTokens);
    return loginUserResponseDto;
  }

  @Post('logout-user')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(SetCookiesInterceptor)
  public async logoutUser(
    @GetUserFromReq('username') username: string,
  ): Promise<void> {
    const userLoggedOutOrError = await this._userAuthUseCaseProxy
      .getInstance()
      .logoutUser(username);
    if (userLoggedOutOrError.isFailure) {
      this.handleFailedResult(userLoggedOutOrError.getError());
    }
  }
}
