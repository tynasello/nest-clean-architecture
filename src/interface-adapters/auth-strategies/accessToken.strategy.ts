import { AuthTokenService } from '@application/services/AuthToken.service';
import { AuthService } from '@application/use-cases/Auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

export type JwtPayload = {
  sub: string;
  username: string;
};

function extractAccessTokenFromCookie(req: Request) {
  return req && req.cookies ? req.cookies['accessToken'] : null;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly authTokenService: AuthTokenService,
  ) {
    super({
      ignoreExpiration: true,
      jwtFromRequest: extractAccessTokenFromCookie,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { refreshToken } = req.cookies;
    let { accessToken } = req.cookies;
    const accessTokenPayload = this.authTokenService.decodeJwt(accessToken);
    const accessTokenExpired = Date.now() >= accessTokenPayload.exp * 1000;

    if (accessTokenExpired) {
      const refreshAccessTokenOrError = await this.authService.refreshTokens({
        username: accessTokenPayload.username,
        refreshToken,
      });

      if (refreshAccessTokenOrError.isFailure)
        throw new UnauthorizedException();

      accessToken = refreshAccessTokenOrError.getValue().accessToken;
    }

    return { accessToken, ...payload };
  }
}
