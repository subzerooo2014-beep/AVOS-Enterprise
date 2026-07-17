import { Injectable } from "@nestjs/common";
import { KnowledgeRuntimeContextItem } from "./knowledge-runtime.types";

interface CacheEntry {
  value: KnowledgeRuntimeContextItem;
  expiresAt: number;
}

@Injectable()
export class KnowledgeRuntimeCacheService {
  private readonly entries = new Map<string, CacheEntry>();
  private hits = 0;
  private misses = 0;

  get(key: string): KnowledgeRuntimeContextItem | undefined {
    const entry = this.entries.get(key);
    if (!entry) {
      this.misses += 1;
      return undefined;
    }
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      this.misses += 1;
      return undefined;
    }
    this.hits += 1;
    return structuredClone(entry.value);
  }

  set(key: string, value: KnowledgeRuntimeContextItem, ttlMs = 60_000): void {
    this.entries.set(key, { value: structuredClone(value), expiresAt: Date.now() + Math.max(1_000, ttlMs) });
  }

  invalidate(predicate?: (key: string, value: KnowledgeRuntimeContextItem) => boolean): number {
    let removed = 0;
    for (const [key, entry] of this.entries.entries()) {
      if (!predicate || predicate(key, entry.value)) {
        this.entries.delete(key);
        removed += 1;
      }
    }
    return removed;
  }

  stats() {
    return { size: this.entries.size, hits: this.hits, misses: this.misses };
  }
}
