import { Injectable } from "@nestjs/common";
import { KernelDeadLetter } from "../enterprise-kernel-mega-pack-5.types";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelDeadLetterService {
  private readonly records = new Map<string, KernelDeadLetter>();

  constructor(
    private readonly audit: KernelMessagingAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  add(input: {
    messageId: string;
    subscriptionId: string;
    reason: string;
    attempts: number;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const record: KernelDeadLetter = {
      id: `kernel-dead-letter:${Date.now()}:${this.records.size + 1}`,
      messageId: input.messageId,
      subscriptionId: input.subscriptionId,
      reason: input.reason,
      attempts: input.attempts,
      replayed: false,
      replayCount: 0,
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "dead-letter",
      action: "kernel-message-dead-lettered",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "failure",
      metadata: {
        messageId: record.messageId,
        subscriptionId: record.subscriptionId,
        attempts: record.attempts
      }
    });

    return record;
  }

  markReplayed(input: {
    deadLetterId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.records.get(input.deadLetterId);

    if (!current) {
      throw new Error(`Kernel dead letter not found: ${input.deadLetterId}`);
    }

    const updated: KernelDeadLetter = {
      ...current,
      replayed: true,
      replayCount: current.replayCount + 1,
      replayedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "dead-letter",
      action: "kernel-dead-letter-replayed",
      subjectId: updated.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        replayCount: updated.replayCount
      }
    });

    return updated;
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      replayed: records.filter((x) => x.replayed).length,
      pendingReplay: records.filter((x) => !x.replayed).length
    };
  }
}
