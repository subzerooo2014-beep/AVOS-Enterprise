import { Injectable } from "@nestjs/common";
import { KernelMessageEnvelope } from "../enterprise-kernel-mega-pack-5.types";
import { KernelMessageFactoryService } from "../contracts/kernel-message-factory.service";
import { KernelDeliveryService } from "../delivery/kernel-delivery.service";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelEventBusService {
  private readonly events = new Map<string, KernelMessageEnvelope>();

  constructor(
    private readonly factory: KernelMessageFactoryService,
    private readonly delivery: KernelDeliveryService,
    private readonly audit: KernelMessagingAuditService
  ) {}

  publish(input: {
    contractId: string;
    payload: Record<string, unknown>;
    producerId: string;
    actorIdentityId: string;
    correlationId: string;
    causationId?: string;
    traceId?: string;
    headers?: Record<string, string>;
    simulateFailureForConsumerIds?: string[];
  }) {
    const event = this.factory.create(input);

    if (event.kind !== "event") {
      throw new Error(`Kernel contract is not an event contract: ${event.contractId}`);
    }

    event.status = "queued";
    event.updatedAt = new Date().toISOString();
    this.events.set(event.id, event);

    const delivery = this.delivery.deliver({
      message: event,
      actorIdentityId: input.actorIdentityId,
      simulateFailureForConsumerIds: input.simulateFailureForConsumerIds
    });

    event.status =
      delivery.deadLettered > 0
        ? "dead-lettered"
        : delivery.failed > 0
          ? "failed"
          : "delivered";

    event.updatedAt = new Date().toISOString();
    this.events.set(event.id, event);

    this.audit.record({
      correlationId: input.correlationId,
      category: "event",
      action: "kernel-event-published",
      subjectId: event.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        event.status === "delivered"
          ? "success"
          : event.status === "failed"
            ? "failure"
            : "warning",
      metadata: {
        contractId: event.contractId,
        delivery
      }
    });

    return {
      event,
      delivery
    };
  }

  list() {
    return Array.from(this.events.values());
  }

  summary() {
    const events = this.list();

    return {
      total: events.length,
      delivered: events.filter((x) => x.status === "delivered").length,
      failed: events.filter((x) => x.status === "failed").length,
      deadLettered: events.filter((x) => x.status === "dead-lettered").length
    };
  }
}
