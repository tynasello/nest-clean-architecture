import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (context.getType() === 'http') {
      const http = context.switchToHttp();
      const response = http.getResponse();

      return next.handle().pipe(
        tap(async (data) => {
          response.cookie('accessToken', data?.accessToken || '', {
            httpOnly: true,
          });
          response.cookie('refreshToken', data?.refreshToken || '', {
            httpOnly: true,
          });
        }),
      );
    }

    return next.handle();
  }
}
