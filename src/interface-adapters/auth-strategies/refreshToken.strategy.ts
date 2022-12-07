import { JwtPayload } from '@interface-adapters/auth-strategies/accessToken.strategy';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };

export function extractRefreshTokenFromCookie(req: Request) {
  return req && req.cookies ? req.cookies['refreshToken'] : null;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: extractRefreshTokenFromCookie,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayloadWithRefreshToken) {
    const refreshToken = extractRefreshTokenFromCookie(req);
    return { ...payload, refreshToken };
  }
}
