import { Injectable, NotFoundException } from "@nestjs/common";
import { DeadLetterRecord } from "../foundation-pack-6.types";
import { NervousSystemTraceService } from "../observability/nervous-system-trace.service";

@Injectable()
export class DeadLetterQueueService {
  private readonly records = new Map<string, DeadLetterRecord>();

  constructor(
    private readonly trace: NervousSystemTraceService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Dead letter record not found: ${id}`);
    }

    return record;
  }

  add(input: Omit<DeadLetterRecord, "id" | "createdAt">) {
    const record: DeadLetterRecord = {
      ...input,
      id: `dead-letter:${Date.now()}:${this.records.size + 1}`,
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.trace.record({
      correlationId: record.correlationId,
      category: "recovery",
      action: "dead-lettered",
      subjectId: record.sourceId,
      actorIdentityId: "identity:enterprise-nervous-system",
      outcome: "failure",
      metadata: {
        deadLetterId: record.id,
        sourceType: record.sourceType,
        attempts: record.attempts
      }
    });

    return record;
  }

  markReplayed(id: string) {
    const current = this.get(id);
    const updated: DeadLetterRecord = {
      ...current,
      replayedAt: new Date().toISOString()
    };

    this.records.set(id, updated);

    this.trace.record({
      correlationId: updated.correlationId,
      category: "recovery",
      action: "replay-requested",
      subjectId: updated.sourceId,
      actorIdentityId: "identity:enterprise-nervous-system",
      outcome: "pending",
      metadata: {
        deadLetterId: updated.id
      }
    });

    return updated;
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      replayed: records.filter((record) => Boolean(record.replayedAt))
        .length,
      pendingReplay: records.filter((record) => !record.replayedAt).length
    };
  }
}
