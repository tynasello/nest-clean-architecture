import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from './accessToken.strategy';

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };

function extractRefreshTokenFromCookie(req: Request) {
  return req && req.cookies ? req.cookies['refreshToken'] : null;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: extractRefreshTokenFromCookie,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayloadWithRefreshToken) {
    const refreshToken = extractRefreshTokenFromCookie(req);
    return { ...payload, refreshToken };
  }
}
