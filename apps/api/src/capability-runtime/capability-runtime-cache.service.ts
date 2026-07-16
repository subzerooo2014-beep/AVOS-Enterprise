import { Injectable } from "@nestjs/common";

interface CacheEntry {
  value: unknown;
  expiresAt?: number;
  createdAt: string;
  hits: number;
}

@Injectable()
export class CapabilityRuntimeCacheService {
  private readonly entries = new Map<string, CacheEntry>();

  set(key: string, value: unknown, ttlMs?: number) {
    this.entries.set(key, {
      value: structuredClone(value),
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
      createdAt: new Date().toISOString(),
      hits: 0,
    });

    return { success: true, key, ttlMs };
  }

  get(key: string) {
    const entry = this.entries.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return null;
    }

    entry.hits += 1;
    return structuredClone(entry.value);
  }

  delete(key: string) {
    return this.entries.delete(key);
  }

  clearPrefix(prefix: string) {
    let removed = 0;

    for (const key of this.entries.keys()) {
      if (key.startsWith(prefix)) {
        this.entries.delete(key);
        removed += 1;
      }
    }

    return { removed };
  }

  snapshot() {
    return {
      entries: this.entries.size,
      totalHits: [...this.entries.values()].reduce(
        (total, entry) => total + entry.hits,
        0,
      ),
      generatedAt: new Date().toISOString(),
    };
  }
}