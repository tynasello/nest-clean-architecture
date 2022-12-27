import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserFromReq = createParamDecorator(
  (key: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);
