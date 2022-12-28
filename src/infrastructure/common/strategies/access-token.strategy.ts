import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GetUserUseCase } from 'src/application/use-cases/get-user-use-case';
import { User } from 'src/domain/entities/user';
import { UseCaseProxy } from 'src/infrastructure/use-cases-proxy/use-cases-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/use-cases-proxy/use-cases-proxy.module';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly _configService: ConfigService,
    @Inject(UseCaseProxyModule.GET_USER_USE_CASE_PROXY)
    private readonly _getUserUseCaseProxy: UseCaseProxy<GetUserUseCase>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.accessToken || request.headers.accesstoken; // the latter is for e2e tests (supertest is only capable of storing cookies in headers)
        },
      ]),
      secretOrKey: _configService.get<string>('AUTH_TOKEN_SECRET'),
    });
  }

  async validate(payload: any): Promise<User> {
    const existingUserOrError = await this._getUserUseCaseProxy
      .getInstance()
      .getUser(payload.username);
    if (existingUserOrError.isFailure) {
      throw new UnauthorizedException();
    }
    const existingUser = existingUserOrError.getValue();
    return existingUser;
  }
}
