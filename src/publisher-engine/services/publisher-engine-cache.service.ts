import { Injectable } from "@nestjs/common";
import { PublisherMemoryCacheService } from "./publisher-memory-cache.service";

@Injectable()
export class PublisherEngineCacheService {
  constructor(
    private readonly cache: PublisherMemoryCacheService,
  ) {}

  remember(key: string, value: any) {
    this.cache.set(key, value);
    return value;
  }

  recall(key: string) {
    return this.cache.get(key);
  }

  forget(key: string) {
    this.cache.remove(key);
  }

  flush() {
    this.cache.clear();
  }
}
