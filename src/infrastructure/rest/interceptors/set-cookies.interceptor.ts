import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const http = context.switchToHttp();
    const response = http.getResponse();

    return next.handle().pipe(
      tap(async (data) => {
        // access token
        if (data?.accessToken) {
          response.cookie('accessToken', data.accessToken, {
            httpOnly: true,
          });
        } else {
          response.clearCookie('accessToken');
        }
        // refresh token
        if (data?.refreshToken) {
          response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
          });
        } else {
          response.clearCookie('refreshToken');
        }
      }),
      map((value) => {
        // remove auth tokens from response (they are already stored in http only cookies)
        if (value) {
          delete value.accessToken;
          delete value.refreshToken;
          return Object.keys(value).length === 0 ? null : value;
        }
      }),
    );
  }
}
