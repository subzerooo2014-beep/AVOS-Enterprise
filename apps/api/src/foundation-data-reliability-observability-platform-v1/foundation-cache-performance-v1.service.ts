import { Injectable } from "@nestjs/common";
import type { FoundationCacheEntryV1 } from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationCachePerformanceV1Service {
  private readonly cache = new Map<string, FoundationCacheEntryV1>();

  set(key: string, value: unknown, ttlSeconds?: number): FoundationCacheEntryV1 {
    const entry: FoundationCacheEntryV1 = {
      key,
      value,
      expiresAt:
        ttlSeconds && ttlSeconds > 0
          ? new Date(Date.now() + ttlSeconds * 1000).toISOString()
          : undefined,
      createdAt: new Date().toISOString(),
    };

    this.cache.set(key, entry);
    return { ...entry };
  }

  get(key: string): unknown {
    const entry = this.cache.get(key);

    if (!entry) return undefined;

    if (entry.expiresAt && new Date(entry.expiresAt).getTime() <= Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  remove(key: string): boolean {
    return this.cache.delete(key);
  }

  count(): number {
    for (const key of Array.from(this.cache.keys())) {
      this.get(key);
    }

    return this.cache.size;
  }
}
