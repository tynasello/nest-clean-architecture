import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwt_decode from 'jwt-decode';

type JwtSignOptions = {
  secret: string;
  expiresIn: number;
};

@Injectable()
export class AuthTokenService {
  constructor(private readonly jwtService: JwtService) {}

  public async signJwt(
    payload: string | object | Buffer,
    options?: JwtSignOptions,
  ) {
    return await this.jwtService.signAsync(payload, options);
  }

  public decodeJwt(jwt: string) {
    return jwt_decode(jwt) as any;
  }
}
