import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobCacheService {
  private readonly cache = new Map<string, any>();

  put(id: string, value: any) {
    this.cache.set(id, value);
  }

  get(id: string) {
    return this.cache.get(id);
  }

  remove(id: string) {
    this.cache.delete(id);
  }

  clear() {
    this.cache.clear();
  }
}
