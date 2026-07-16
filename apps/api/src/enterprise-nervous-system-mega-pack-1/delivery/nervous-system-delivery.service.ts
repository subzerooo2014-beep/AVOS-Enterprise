import { Injectable } from "@nestjs/common";
import {
  NervousSystemDelivery,
  NervousSystemEventEnvelope
} from "../enterprise-nervous-system-mega-pack-1.types";
import { NervousSystemEndpointRegistryService } from "../producers/nervous-system-endpoint-registry.service";
import { NervousSystemCorrelationService } from "../correlation/nervous-system-correlation.service";
import { NervousSystemAuditService } from "../observability/nervous-system-audit.service";

@Injectable()
export class NervousSystemDeliveryService {
  private readonly deliveries =
    new Map<string, NervousSystemDelivery>();

  constructor(
    private readonly endpoints: NervousSystemEndpointRegistryService,
    private readonly correlation: NervousSystemCorrelationService,
    private readonly audit: NervousSystemAuditService
  ) {}

  list() {
    return Array.from(this.deliveries.values());
  }

  get(id: string) {
    const delivery = this.deliveries.get(id);

    if (!delivery) {
      throw new Error(`Nervous System delivery not found: ${id}`);
    }

    return delivery;
  }

  createForEvent(
    event: NervousSystemEventEnvelope,
    maxAttempts = 3
  ) {
    const consumers =
      this.endpoints.consumersForTopic(event.topic);

    const created: NervousSystemDelivery[] = [];

    for (const consumer of consumers) {
      const now = new Date().toISOString();

      const delivery: NervousSystemDelivery = {
        id: `nervous-delivery:${Date.now()}:${
          this.deliveries.size + 1
        }`,
        eventId: event.id,
        consumerId: consumer.id,
        attempt: 0,
        maxAttempts: Math.max(1, maxAttempts),
        status: "pending",
        createdAt: now,
        updatedAt: now
      };

      this.deliveries.set(delivery.id, delivery);

      this.correlation.attachDelivery(
        event.correlationId,
        event.traceId,
        delivery.id,
        false
      );

      created.push(delivery);
    }

    return created;
  }

  deliver(
    deliveryId: string,
    event: NervousSystemEventEnvelope
  ) {
    const current = this.get(deliveryId);
    const consumer = this.endpoints.getConsumer(current.consumerId);

    this.endpoints.updateConsumerConcurrency(consumer.id, 1);

    const delivering: NervousSystemDelivery = {
      ...current,
      status: "delivering",
      attempt: current.attempt + 1,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.deliveries.set(delivering.id, delivering);

    try {
      if (consumer.status !== "active") {
        throw new Error(
          `Consumer is not active: ${consumer.status}`
        );
      }

      if (
        event.priority === "critical" &&
        consumer.requiresHumanApprovalForCritical &&
        event.headers["x-avos-human-approved"] !== "true"
      ) {
        throw new Error(
          "Critical event requires human approval."
        );
      }

      const completed: NervousSystemDelivery = {
        ...delivering,
        status: "delivered",
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.deliveries.set(completed.id, completed);

      this.audit.record({
        correlationId: event.correlationId,
        category: "delivery",
        action: "nervous-system-event-delivered",
        subjectId: completed.id,
        actorIdentityId: consumer.id,
        outcome: "success",
        metadata: {
          eventId: event.id,
          consumerId: consumer.id
        }
      });

      return completed;
    }
    catch (error) {
      const failed: NervousSystemDelivery = {
        ...delivering,
        status:
          delivering.attempt >= delivering.maxAttempts
            ? "failed"
            : "retrying",
        error:
          error instanceof Error
            ? error.message
            : String(error),
        nextRetryAt:
          delivering.attempt >= delivering.maxAttempts
            ? undefined
            : new Date(
                Date.now() +
                Math.pow(2, delivering.attempt) * 1000
              ).toISOString(),
        completedAt:
          delivering.attempt >= delivering.maxAttempts
            ? new Date().toISOString()
            : undefined,
        updatedAt: new Date().toISOString()
      };

      this.deliveries.set(failed.id, failed);

      this.correlation.attachDelivery(
        event.correlationId,
        event.traceId,
        failed.id,
        true
      );

      this.audit.record({
        correlationId: event.correlationId,
        category: "delivery",
        action: "nervous-system-event-delivery-failed",
        subjectId: failed.id,
        actorIdentityId: consumer.id,
        outcome:
          failed.status === "failed"
            ? "failure"
            : "warning",
        metadata: {
          eventId: event.id,
          consumerId: consumer.id,
          attempt: failed.attempt,
          error: failed.error
        }
      });

      return failed;
    }
    finally {
      this.endpoints.updateConsumerConcurrency(consumer.id, -1);
    }
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      pending: items.filter((x) => x.status === "pending").length,
      delivering: items.filter((x) => x.status === "delivering").length,
      delivered: items.filter((x) => x.status === "delivered").length,
      retrying: items.filter((x) => x.status === "retrying").length,
      failed: items.filter((x) => x.status === "failed").length,
      deadLettered:
        items.filter((x) => x.status === "dead-lettered").length
    };
  }
}
