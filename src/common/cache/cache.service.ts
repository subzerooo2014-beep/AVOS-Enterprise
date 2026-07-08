import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheService {
  private cache = new Map<string, any>();

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: any) {
    this.cache.set(key, value);
    return value;
  }

  delete(key: string) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}
