import { Injectable } from "@nestjs/common";
import { NervousThrottleBucket } from "../enterprise-nervous-system-mega-pack-2.types";
import { NervousRoutingAuditService } from "../observability/nervous-routing-audit.service";

@Injectable()
export class NervousThrottlingService {
  private readonly buckets =
    new Map<string, NervousThrottleBucket>();

  constructor(
    private readonly audit: NervousRoutingAuditService
  ) {}

  consume(input: {
    subscriptionId: string;
    limit: number;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const key = input.subscriptionId;
    const now = Date.now();
    const current = this.buckets.get(key);

    const expired =
      !current ||
      now - new Date(current.windowStartedAt).getTime() >= 60000;

    const bucket: NervousThrottleBucket = expired
      ? {
          id: `throttle:${input.subscriptionId}`,
          subscriptionId: input.subscriptionId,
          windowStartedAt: new Date().toISOString(),
          consumed: 0,
          limit: input.limit,
          updatedAt: new Date().toISOString()
        }
      : current;

    const allowed = bucket.consumed < bucket.limit;

    const updated: NervousThrottleBucket = {
      ...bucket,
      consumed: allowed
        ? bucket.consumed + 1
        : bucket.consumed,
      limit: input.limit,
      updatedAt: new Date().toISOString()
    };

    this.buckets.set(key, updated);

    if (!allowed) {
      this.audit.record({
        correlationId: input.correlationId,
        category: "throttling",
        action: "nervous-subscription-throttled",
        subjectId: input.subscriptionId,
        actorIdentityId: input.actorIdentityId,
        outcome: "warning",
        metadata: {
          limit: updated.limit,
          consumed: updated.consumed
        }
      });
    }

    return {
      allowed,
      bucket: updated
    };
  }

  list() {
    return Array.from(this.buckets.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      saturated:
        items.filter((item) => item.consumed >= item.limit).length,
      consumed:
        items.reduce((sum, item) => sum + item.consumed, 0)
    };
  }
}
