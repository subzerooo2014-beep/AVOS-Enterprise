import { Injectable } from "@nestjs/common";

interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
  version: number;
  updatedAt: string;
}

@Injectable()
export class PersistenceCacheService {
  private readonly entries = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, value: T, ttlMs?: number): void {
    const current = this.entries.get(key);

    this.entries.set(key, {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
      version: (current?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    });
  }

  get<T>(key: string): T | undefined {
    const entry = this.entries.get(key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }

  size(): number {
    this.cleanupExpired();
    return this.entries.size;
  }

  snapshot() {
    this.cleanupExpired();

    return Array.from(this.entries.entries()).map(([key, entry]) => ({
      key,
      version: entry.version,
      updatedAt: entry.updatedAt,
      expiresAt: entry.expiresAt
        ? new Date(entry.expiresAt).toISOString()
        : undefined,
    }));
  }

  private cleanupExpired(): void {
    const now = Date.now();

    for (const [key, entry] of this.entries.entries()) {
      if (entry.expiresAt && entry.expiresAt <= now) {
        this.entries.delete(key);
      }
    }
  }
}
