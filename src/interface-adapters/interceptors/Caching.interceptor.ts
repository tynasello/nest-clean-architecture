import { CacheService } from '@interface-adapters/Cache.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class CachingInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (context.getType<GqlContextType>() !== 'graphql') {
      return next.handle();
    }

    // interceptor for gql queries

    const gqlContext = GqlExecutionContext.create(context);
    const gqlInfo = gqlContext.getInfo();

    // on mutable operations, clear cache for specific keys
    if (gqlInfo.path.typename !== 'Query') {
      const keysToRemoveFromCache = ['getUsers'];

      // //* add additional dtos (ones connected to a controller that nullify getUserById cache) that may be in variableValues
      const dbId = JSON.stringify(gqlInfo.variableValues.updateUserDto?.id);
      if (dbId) keysToRemoveFromCache.push(`getUserById{"userId":${dbId}}`);

      return next.handle().pipe(
        tap({
          next: (res: unknown): void => {
            if (res instanceof Error) return;
            keysToRemoveFromCache.forEach((cachedKey) => {
              // console.log(
              //   `Deleting ${cachedKey} in cache (from CachingInterceptor)`,
              // );
              this.cacheService.delete(cachedKey);
            });
            // console.log('Clearing cache (from CacheInterceptor)');
            // this.cacheService.reset();
          },
        }),
      );
    }

    const fieldName = gqlInfo.fieldName;
    const variableValues =
      Object.keys(gqlInfo.variableValues).length !== 0
        ? JSON.stringify(gqlInfo.variableValues)
        : '';
    const cacheKey = `${fieldName}${variableValues}`;

    // see if controller response already cached, if so return

    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      // console.log(`Getting ${cacheKey} in cache (from CachingInterceptor)`);
      return of(cachedData);
    }

    // continue to controller and cache response

    return next.handle().pipe(
      tap({
        next: async (res: unknown): Promise<void> => {
          if (res instanceof Error) return;
          // console.log(`Caching ${cacheKey} (from CachingInterceptor)`);
          await this.cacheService.set(cacheKey, res);
          await this.cacheService.delete(`${cacheKey}/*`);
        },
      }),
    );
  }
}
