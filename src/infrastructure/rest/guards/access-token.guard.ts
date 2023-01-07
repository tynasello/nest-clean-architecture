import {
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthUseCase } from '../../../application/use-cases/user-auth-use-case';
import { AuthTokenService } from '../../services/auth-token/auth-token.service';
import { UseCaseProxy } from '../../use-cases-proxy/use-cases-proxy';
import { UseCaseProxyModule } from '../../use-cases-proxy/use-cases-proxy.module';

export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(AuthTokenService)
    private readonly _authTokenService: AuthTokenService,
    @Inject(UseCaseProxyModule.USER_AUTH_USE_CASE_PROXY)
    private readonly _authUseCaseProxy: UseCaseProxy<UserAuthUseCase>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    try {
      const accessToken =
        request?.cookies?.accessToken || request.headers.accesstoken; // the latter is for e2e tests (supertest is only capable of storing cookies in headers)
      if (!accessToken) throw new UnauthorizedException();
      const isValidAccessToken = await this._authTokenService.verifyAuthToken(
        accessToken,
      );
      if (isValidAccessToken) return this.activate(context);

      // if access token is invalid, try to refresh it
      const refreshToken = request?.cookies?.refreshToken;
      if (
        !refreshToken ||
        !(await this._authTokenService.verifyAuthToken(refreshToken))
      )
        throw new UnauthorizedException();

      // refresh access token using refresh token
      const decodedRefreshToken =
        this._authTokenService.decodeAuthToken(refreshToken);
      const refreshedAccessTokenOrError = await this._authUseCaseProxy
        .getInstance()
        .refreshAccessToken(decodedRefreshToken?.username, refreshToken);
      if (refreshedAccessTokenOrError.isFailure) {
        throw new UnauthorizedException();
      }

      // update req and res objects with refreshed access token
      const refreshedAccessToken = refreshedAccessTokenOrError.getValue();
      request.cookies.accessToken = refreshedAccessToken;
      response.cookie('accessToken', refreshedAccessToken || '', {
        httpOnly: true,
      });

      return this.activate(context);
    } catch (err) {
      // clear cookies if (unauthenticated) error
      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');
      throw err;
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
