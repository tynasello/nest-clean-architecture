import { LoginUserDto } from '@application/contracts/dtos/user/LoginUser.dto';
import { RefreshAccessTokenDto } from '@application/contracts/dtos/user/RefreshAccessToken.dto';
import { SignupUserDto } from '@application/contracts/dtos/user/SignupUser.dto';
import { Guard } from '@application/logic/Guard';
import { Result } from '@application/logic/Result';
import { CUSTOM_ERRORS } from '@domain/CustomErrors';
import { User } from '@domain/entities/User';
import { UserPassword } from '@domain/value-objects/user/UserPassword';
import { AuthTokenService } from '@interface-adapters/services/AuthToken.service';
import { HashService } from '@interface-adapters/services/Hash.service';
import { Injectable } from '@nestjs/common';
import { UserService } from './User.service';

type AuthTokens = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  public async login(loginUserDto: LoginUserDto): Promise<Result<any>> {
    const usernameOrError = Guard.againstNullOrUndefined(
      loginUserDto.username,
      'username',
    );
    const passwordOrError = Guard.againstNullOrUndefined(
      loginUserDto.password,
      'password',
    );

    const combinedPropsResult = Result.combine([
      usernameOrError,
      passwordOrError,
    ]);

    if (combinedPropsResult.isFailure) {
      return Result.fail(combinedPropsResult.getError());
    }

    const userOrError = await this.userService.getUserByUsername(
      loginUserDto.username,
    );

    if (userOrError.isFailure) return Result.fail(userOrError.getError());

    const user = userOrError.getValue() as User;

    const passwordMatches = await HashService.compare(
      loginUserDto.password,
      user.props.password.value,
    );

    if (!passwordMatches)
      return Result.fail({
        code: CUSTOM_ERRORS.AUTHENTICATION_ERROR,
        msg: 'Invalid login credentials',
      });

    const userAuthTokens = await this.createTokens(user);

    await this.userService.updateUserRefreshToken({
      username: user.props.username.value,
      refreshToken: await HashService.hash(userAuthTokens.refreshToken),
    });

    return Result.ok(userAuthTokens);
  }

  public async signup(signupUserDto: SignupUserDto): Promise<Result<any>> {
    const passwordOrError = UserPassword.create({
      value: signupUserDto.password,
    });

    if (passwordOrError.isFailure)
      return Result.fail(passwordOrError.getError());

    const hashedUserPassword = await HashService.hash(signupUserDto.password);

    const userOrError = await this.userService.createUser({
      ...signupUserDto,
      password: hashedUserPassword,
    });

    if (userOrError.isFailure) return Result.fail(userOrError.getError());

    const user = userOrError.getValue() as User;

    const userAuthTokens = await this.createTokens(user);

    await this.userService.updateUserRefreshToken({
      username: user.props.username.value,
      refreshToken: await HashService.hash(userAuthTokens.refreshToken),
    });

    return Result.ok(userAuthTokens);
  }

  public async logout(username: string): Promise<Result<any>> {
    await this.userService.updateUserRefreshToken({
      username: username,
      refreshToken: '',
    });

    return Result.ok();
  }

  public async refreshTokens(
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<Result<any>> {
    const userOrError = await this.userService.getUserByUsername(
      refreshAccessTokenDto.username,
    );

    if (userOrError.isFailure) return userOrError;

    const user = userOrError.getValue() as User;

    const refreshTokenMatches = await HashService.compare(
      refreshAccessTokenDto.refreshToken,
      user.props.refreshToken,
    );

    if (!refreshTokenMatches)
      return Result.fail({
        code: CUSTOM_ERRORS.AUTHENTICATION_ERROR,
        msg: 'Refresh token invalid',
      });

    const newAccessToken = await this.createAccessToken(user);

    return Result.ok({ accessToken: newAccessToken });
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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
