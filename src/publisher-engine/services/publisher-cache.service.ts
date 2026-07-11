import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherCacheService {
  private readonly cache = new Map<string, any>();

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: any) {
    this.cache.set(key, value);
    return value;
  }

  has(key: string) {
    return this.cache.has(key);
  }

  delete(key: string) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  stats() {
    return {
      keys: this.cache.size,
    };
  }
}
