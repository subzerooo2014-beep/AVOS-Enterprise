import { Injectable } from "@nestjs/common";
import { NervousSystemDeadLetter } from "../enterprise-nervous-system-mega-pack-1.types";
import { NervousSystemDeliveryService } from "../delivery/nervous-system-delivery.service";
import { NervousSystemAuditService } from "../observability/nervous-system-audit.service";

@Injectable()
export class NervousSystemDeadLetterService {
  private readonly records =
    new Map<string, NervousSystemDeadLetter>();

  constructor(
    private readonly deliveries: NervousSystemDeliveryService,
    private readonly audit: NervousSystemAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  add(input: {
    eventId: string;
    consumerId: string;
    deliveryId: string;
    reason: string;
    payloadSnapshot: unknown;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const delivery = this.deliveries.get(input.deliveryId);

    const record: NervousSystemDeadLetter = {
      id: `nervous-dead-letter:${Date.now()}:${this.records.size + 1}`,
      eventId: input.eventId,
      consumerId: input.consumerId,
      deliveryId: delivery.id,
      reason: input.reason,
      payloadSnapshot: input.payloadSnapshot,
      replayed: false,
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "dead-letter",
      action: "nervous-system-dead-letter-created",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "warning",
      metadata: {
        eventId: record.eventId,
        consumerId: record.consumerId
      }
    });

    return record;
  }

  markReplayed(id: string) {
    const current = this.records.get(id);

    if (!current) {
      throw new Error(`Dead letter not found: ${id}`);
    }

    const updated: NervousSystemDeadLetter = {
      ...current,
      replayed: true,
      replayedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      replayed: items.filter((x) => x.replayed).length,
      pendingReplay: items.filter((x) => !x.replayed).length
    };
  }
}
