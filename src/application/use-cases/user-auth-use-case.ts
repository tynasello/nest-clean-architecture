import { ConfigService } from '@nestjs/config';
import { User } from '../../domain/entities/user';
import { CUSTOM_ERRORS } from '../../domain/errors/custom-errors';
import { IAuthTokenService } from '../interfaces/auth-token-service.interface';
import { IHashService } from '../interfaces/hash-service.interface';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { Result } from '../logic/result';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export class UserAuthUseCase {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _userRepository: IUserRepository,
    private readonly _hashService: IHashService,
    private readonly _authTokenService: IAuthTokenService,
  ) {}

  public async signupUser(user: Omit<User, 'id'>): Promise<Result<AuthTokens>> {
    const existingUserOrError = await this._userRepository.getUserByUsername(
      user.username,
    );
    if (existingUserOrError.isSuccess) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        message: 'User already exists.',
      });
    }
    const hashedPassword = this._hashService.hash(user.password);
    const createdUserOrError = await this._userRepository.createUser({
      ...user,
      password: hashedPassword,
    });
    if (createdUserOrError.isFailure) {
      return Result.fail(createdUserOrError.getError());
    }
    const createdUser = createdUserOrError.getValue();
    const createdAuthTokens = await this.createAuthTokens(createdUser);

    // upsert newly created refresh token to created user
    await this._userRepository.upsertRefreshToken(
      createdUser.username,
      this._hashService.hash(createdAuthTokens.refreshToken),
    );

    return Result.ok<AuthTokens>(createdAuthTokens);
  }

  public async loginUser(
    user: Pick<User, 'username' | 'password'>,
  ): Promise<Result<AuthTokens>> {
    const existingUserOrError = await this._userRepository.getUserByUsername(
      user.username,
    );
    if (existingUserOrError.isFailure) {
      return Result.fail(existingUserOrError.getError());
    }
    const existingUser = existingUserOrError.getValue();
    const passwordsMatch = this._hashService.compare(
      user.password,
      existingUser.password,
    );
    if (!passwordsMatch) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        message: 'Invalid password.',
      });
    }
    const createdAuthTokens = await this.createAuthTokens(existingUser);

    // upsert newly created refresh token to created user
    await this._userRepository.upsertRefreshToken(
      existingUser.username,
      this._hashService.hash(createdAuthTokens.refreshToken),
    );
    return Result.ok<AuthTokens>(createdAuthTokens);
  }

  public async logoutUser(username: string): Promise<Result<any>> {
    const existingUserOrError = await this._userRepository.getUserByUsername(
      username,
    );
    if (existingUserOrError.isFailure) {
      return Result.fail(existingUserOrError.getError());
    }
    const existingUser = existingUserOrError.getValue();

    // clear user's refresh token
    await this._userRepository.upsertRefreshToken(existingUser.username, null);
    return Result.ok();
  }

  public async refreshAccessToken(
    username: string,
    refreshToken: string,
  ): Promise<Result<string>> {
    const existingUserOrError = await this._userRepository.getUserByUsername(
      username,
    );
    if (existingUserOrError.isFailure) {
      return Result.fail(existingUserOrError.getError());
    }
    const existingUser = existingUserOrError.getValue();
    const refreshTokensMatch = this._hashService.compare(
      refreshToken,
      existingUser.refreshToken,
    );
    if (!refreshTokensMatch) {
      return Result.fail({
        code: CUSTOM_ERRORS.USER_INPUT_ERROR,
        message:
          'Cannot refresh access token because of invalid refresh token.',
      });
    }
    const newAccessToken = await this.createAccessToken(existingUser);
    return Result.ok(newAccessToken);
  }

  //HELPERS

  private async createAuthTokens(user: User): Promise<AuthTokens> {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    return { accessToken, refreshToken };
  }

  private async createAccessToken(user: User): Promise<string> {
    return await this._authTokenService.signAuthToken(
      {
        username: user.username,
        signedAt: Date.now(),
        sub: user.id,
      },
      this._configService.get<string>('AUTH_TOKEN_SECRET'),
      600,
    );
  }

  private async createRefreshToken(user: User): Promise<string> {
    return await this._authTokenService.signAuthToken(
      {
        username: user.username,
        signedAt: Date.now(),
        sub: user.id,
      },
      this._configService.get<string>('AUTH_TOKEN_SECRET'),
      604800,
    );
  }
}
