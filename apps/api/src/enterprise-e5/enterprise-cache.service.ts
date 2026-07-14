import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseCacheService {
  private readonly cache = new Map<
    string,
    { value: unknown; expiresAt?: number }
  >();

  set(key: string, value: unknown, ttlMs?: number) {
    this.cache.set(key, {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
    });

    return { key, stored: true, ttlMs: ttlMs || null };
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) {
      return { key, hit: false, value: null };
    }

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return { key, hit: false, value: null };
    }

    return { key, hit: true, value: entry.value };
  }

  delete(key: string) {
    return { key, deleted: this.cache.delete(key) };
  }

  count(): number {
    return this.cache.size;
  }
}