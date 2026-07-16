import { Injectable } from "@nestjs/common";
import { NervousFanoutBatch } from "../enterprise-nervous-system-mega-pack-2.types";
import { NervousRoutingAuditService } from "../observability/nervous-routing-audit.service";

@Injectable()
export class NervousFanoutService {
  private readonly batches =
    new Map<string, NervousFanoutBatch>();

  constructor(
    private readonly audit: NervousRoutingAuditService
  ) {}

  create(input: {
    signalId: string;
    targetSubscriptionIds: string[];
    correlationId: string;
    actorIdentityId: string;
  }) {
    const now = new Date().toISOString();

    const batch: NervousFanoutBatch = {
      id: `nervous-fanout:${Date.now()}:${this.batches.size + 1}`,
      signalId: input.signalId,
      targetSubscriptionIds:
        Array.from(new Set(input.targetSubscriptionIds)),
      completedSubscriptionIds: [],
      failedSubscriptionIds: [],
      status: "created",
      createdAt: now,
      updatedAt: now
    };

    this.batches.set(batch.id, batch);

    this.audit.record({
      correlationId: input.correlationId,
      category: "fanout",
      action: "nervous-fanout-created",
      subjectId: batch.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        targets: batch.targetSubscriptionIds.length
      }
    });

    return batch;
  }

  complete(input: {
    batchId: string;
    completedSubscriptionIds: string[];
    failedSubscriptionIds: string[];
  }) {
    const current = this.batches.get(input.batchId);

    if (!current) {
      throw new Error(`Nervous fanout batch not found: ${input.batchId}`);
    }

    const failed = Array.from(new Set(input.failedSubscriptionIds));
    const completed = Array.from(new Set(input.completedSubscriptionIds));

    const updated: NervousFanoutBatch = {
      ...current,
      completedSubscriptionIds: completed,
      failedSubscriptionIds: failed,
      status:
        failed.length === 0
          ? "completed"
          : completed.length > 0
            ? "partial"
            : "failed",
      updatedAt: new Date().toISOString()
    };

    this.batches.set(updated.id, updated);
    return updated;
  }

  list() {
    return Array.from(this.batches.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      completed: items.filter((x) => x.status === "completed").length,
      partial: items.filter((x) => x.status === "partial").length,
      failed: items.filter((x) => x.status === "failed").length
    };
  }
}
