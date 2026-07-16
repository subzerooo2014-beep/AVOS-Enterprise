import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import type { BulkheadRecord } from "./enterprise-resilience.types";

@Injectable()
export class BulkheadIsolationService {
  private readonly bulkheads = new Map<string, BulkheadRecord>();

  configure(key: string, maxConcurrency: number): BulkheadRecord {
    const existing = this.bulkheads.get(key);

    const record: BulkheadRecord = existing ?? {
      key,
      maxConcurrency,
      active: 0,
      queued: 0,
    };

    record.maxConcurrency = maxConcurrency;
    this.bulkheads.set(key, record);

    return { ...record };
  }

  async execute<T>(key: string, handler: () => Promise<T>): Promise<T> {
    const record =
      this.bulkheads.get(key) ?? this.configure(key, 10);

    if (record.active >= record.maxConcurrency) {
      record.queued += 1;
      throw new ServiceUnavailableException(
        `Bulkhead '${key}' reached maximum concurrency.`,
      );
    }

    record.active += 1;

    try {
      return await handler();
    } finally {
      record.active = Math.max(0, record.active - 1);
      record.queued = Math.max(0, record.queued - 1);
    }
  }

  list(): BulkheadRecord[] {
    return Array.from(this.bulkheads.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.bulkheads.size;
  }
}
