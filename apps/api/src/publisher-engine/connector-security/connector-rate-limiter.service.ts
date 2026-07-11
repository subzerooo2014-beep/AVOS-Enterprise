import { Injectable } from "@nestjs/common";

import {
  ConnectorSecurityChannel,
} from "./connector-credential-vault.service";

interface RateBucket {
  count: number;
  resetAt: number;
}

@Injectable()
export class ConnectorRateLimiterService {
  private readonly buckets =
    new Map<string, RateBucket>();

  private readonly windowMs =
    this.positiveInteger(
      process.env.CONNECTOR_RATE_LIMIT_WINDOW_MS,
      60_000,
    );

  private readonly limit =
    this.positiveInteger(
      process.env.CONNECTOR_RATE_LIMIT_MAX,
      60,
    );

  consume(
    channel: ConnectorSecurityChannel,
    identity = "global",
  ) {
    const now = Date.now();

    const key =
      `${channel}:${identity}`;

    let bucket =
      this.buckets.get(key);

    if (
      !bucket ||
      bucket.resetAt <= now
    ) {
      bucket = {
        count: 0,
        resetAt:
          now + this.windowMs,
      };

      this.buckets.set(
        key,
        bucket,
      );
    }

    if (
      bucket.count >=
      this.limit
    ) {
      return {
        allowed: false,
        channel,
        identity,
        limit:
          this.limit,
        remaining: 0,
        resetAt:
          new Date(
            bucket.resetAt,
          ),
      };
    }

    bucket.count += 1;

    return {
      allowed: true,
      channel,
      identity,
      limit:
        this.limit,

      remaining:
        Math.max(
          0,
          this.limit -
          bucket.count,
        ),

      resetAt:
        new Date(
          bucket.resetAt,
        ),
    };
  }

  status() {
    const now = Date.now();

    const activeBuckets =
      Array.from(
        this.buckets.values(),
      ).filter(
        (bucket) =>
          bucket.resetAt > now,
      ).length;

    return {
      windowMs:
        this.windowMs,
      limit:
        this.limit,
      activeBuckets,
    };
  }

  private positiveInteger(
    value: string | undefined,
    fallback: number,
  ): number {
    const numeric =
      Number(value);

    return Number.isInteger(numeric) &&
      numeric > 0
      ? numeric
      : fallback;
  }
}
