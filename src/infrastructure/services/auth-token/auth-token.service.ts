import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwt_decode from 'jwt-decode';
import { IAuthTokenService } from '../../../application/interfaces/auth-token-service.interface';

@Injectable()
export class AuthTokenService implements IAuthTokenService {
  constructor(private readonly _jwtService: JwtService) {}

  public async signAuthToken(
    payload: { [key: string]: any; sub: string },
    secret: string,
    expiresIn: number,
  ): Promise<string> {
    return await this._jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  public async verifyAuthToken(token: string): Promise<boolean> {
    try {
      await this._jwtService.verifyAsync(token);
      return true;
    } catch (err) {}
    return false;
  }

  public decodeAuthToken(jwt: string) {
    return jwt_decode(jwt) as any;
  }
}
