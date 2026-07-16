import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import type { RateLimitRecord } from "./enterprise-resilience.types";

@Injectable()
export class RateLimiterService {
  private readonly limits = new Map<string, RateLimitRecord>();

  configure(key: string, limit: number, windowMs: number): RateLimitRecord {
    const record: RateLimitRecord = {
      key,
      limit,
      windowMs,
      count: 0,
      windowStartedAt: new Date().toISOString(),
    };

    this.limits.set(key, record);
    return { ...record };
  }

  consume(key: string): RateLimitRecord {
    const record =
      this.limits.get(key) ?? this.configure(key, 100, 60000);

    const windowStart = new Date(record.windowStartedAt).getTime();

    if (Date.now() - windowStart >= record.windowMs) {
      record.count = 0;
      record.windowStartedAt = new Date().toISOString();
    }

    record.count += 1;

    if (record.count > record.limit) {
      throw new HttpException(
        `Rate limit exceeded for '${key}'.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return { ...record };
  }

  list(): RateLimitRecord[] {
    return Array.from(this.limits.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.limits.size;
  }
}

