import { AuthTokens } from '@application/contracts/dtos/user/AuthTokens';
import { LoginUserRequestDto } from '@application/contracts/dtos/user/LoginUser.request.dto';
import { RefreshAccessTokenRequestDto } from '@application/contracts/dtos/user/RefreshAccessToken.request.dto';
import { SignupUserRequestDto } from '@application/contracts/dtos/user/SignupUser.request.dto';
import { GuardProps } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';
import { AuthTokenService } from '@application/services/AuthToken.service';
import { HashService } from '@application/services/Hash.service';
import { UserService } from '@application/use-cases/User.service';
import { User } from '@domain/entities/User';
import { CUSTOM_ERRORS } from '@domain/errors/CustomErrors';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async login(
    loginUserDto: LoginUserRequestDto,
  ): Promise<Result<AuthTokens>> {
    const { username, password } = loginUserDto;
    const usernameOrError = GuardProps.againstNullOrUndefined(
      username,
      'username',
    );
    const passwordOrError = GuardProps.againstNullOrUndefined(
      password,
      'password',
    );

    const combinedPropsResult = Result.combineResults([
      usernameOrError,
      passwordOrError,
    ]);

    if (combinedPropsResult.isFailure) {
      return Result.fail(combinedPropsResult.getError());
    }

    const userOrError = await this.userService.getUserByUsername(username);

    if (userOrError.isFailure) return Result.fail(userOrError.getError());

    const user = userOrError.getValue();

    const passwordMatches = HashService.compare(
      password,
      user.props.password.value,
    );

    if (!passwordMatches)
      return Result.fail({
        code: CUSTOM_ERRORS.AUTHENTICATION_ERROR,
        msg: 'Invalid login credentials',
      });

    const userAuthTokens = await this.createTokens(user);

    await this.userService.updateUser({
      username: user.props.username.value,
      refreshToken: HashService.hash(userAuthTokens.refreshToken),
    });

    return Result.ok(userAuthTokens);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async signup(
    signupUserDto: SignupUserRequestDto,
  ): Promise<Result<AuthTokens>> {
    const { password } = signupUserDto;
    const passwordOrError = UserPassword.create(password);

    if (passwordOrError.isFailure)
      return Result.fail(passwordOrError.getError());

    const userOrError = await this.userService.createUser({
      ...signupUserDto,
      password: HashService.hash(password),
    });

    if (userOrError.isFailure) return Result.fail(userOrError.getError());

    const user = userOrError.getValue();

    const userAuthTokens = await this.createTokens(user);

    this.userService.updateUser({
      username: user.props.username.value,
      refreshToken: HashService.hash(userAuthTokens.refreshToken),
    });

    return Result.ok(userAuthTokens);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async logout(username: string): Promise<Result<any>> {
    const updatedUserOrError = await this.userService.updateUser({
      username,
      refreshToken: null,
    });

    if (updatedUserOrError.isFailure)
      return Result.fail(updatedUserOrError.getError());

    return Result.ok();
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  public async refreshTokens(
    refreshAccessTokenDto: RefreshAccessTokenRequestDto,
  ): Promise<Result<Pick<AuthTokens, 'accessToken'>>> {
    const { username, refreshToken } = refreshAccessTokenDto;
    const userOrError = await this.userService.getUserByUsername(username);

    if (userOrError.isFailure) return Result.fail(userOrError.getError());

    const user = userOrError.getValue();

    const refreshTokenMatches = HashService.compare(
      refreshToken,
      user.props.refreshToken,
    );

    if (!refreshTokenMatches)
      return Result.fail({
        code: CUSTOM_ERRORS.AUTHENTICATION_ERROR,
        msg: 'Refresh token is invalid',
      });

    const newAccessToken = await this.createAccessToken(user);

    return Result.ok({ accessToken: newAccessToken });
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  //HELPERS
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  private async createTokens(user: User): Promise<AuthTokens> {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  private async createAccessToken(user: User): Promise<string> {
    return await this.authTokenService.signJwt(
      {
        username: user.props.username.value,
        signedAt: Date.now(),
        sub: user.props.id,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: 600,
      },
    );
  }

  private async createRefreshToken(user: User): Promise<string> {
    return await this.authTokenService.signJwt(
      {
        username: user.props.username.value,
        signedAt: Date.now(),
        sub: user.props.id,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: 604800,
      },
    );
  }
}
