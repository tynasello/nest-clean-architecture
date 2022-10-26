import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async get<T>(key: string) {
    return (await this.cacheManager.get(key)) as T;
  }

  public async set(key: string, value: any) {
    await this.cacheManager.set(key, value);
  }

  public async delete(key: string) {
    await this.cacheManager.del(key);
  }

  public async reset() {
    await this.cacheManager.reset();
  }
}
