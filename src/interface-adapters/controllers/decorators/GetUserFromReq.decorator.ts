import { JwtPayloadWithRefreshToken } from '@interface-adapters/auth-strategies/refreshToken.strategy';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserFromReq = createParamDecorator(
  (
    key: keyof JwtPayloadWithRefreshToken | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);
