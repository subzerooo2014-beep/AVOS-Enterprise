import { Injectable } from "@nestjs/common";
import { EventDelivery } from "../foundation-pack-6.types";
import { EnterpriseEventBackboneService } from "../events/enterprise-event-backbone.service";
import { EventSubscriptionRegistryService } from "../subscriptions/event-subscription-registry.service";
import { DeadLetterQueueService } from "../recovery/dead-letter-queue.service";
import { NervousSystemTraceService } from "../observability/nervous-system-trace.service";

@Injectable()
export class EnterpriseEventRouterService {
  private readonly deliveries = new Map<string, EventDelivery>();

  constructor(
    private readonly events: EnterpriseEventBackboneService,
    private readonly subscriptions: EventSubscriptionRegistryService,
    private readonly deadLetters: DeadLetterQueueService,
    private readonly trace: NervousSystemTraceService
  ) {}

  list() {
    return Array.from(this.deliveries.values());
  }

  route(eventId: string) {
    const event = this.events.updateState(eventId, "routing");
    const subscriptions = this.subscriptions.matching(event.eventType);
    const deliveries: EventDelivery[] = [];

    for (const subscription of subscriptions) {
      const now = new Date().toISOString();
      const delivery: EventDelivery = {
        id: `event-delivery:${Date.now()}:${
          this.deliveries.size + deliveries.length + 1
        }`,
        eventId: event.id,
        subscriptionId: subscription.id,
        targetCapabilityId: subscription.targetCapabilityId,
        handlerKey: subscription.handlerKey,
        status: "pending",
        attempt: 0,
        maxAttempts: subscription.maxAttempts,
        createdAt: now,
        updatedAt: now
      };

      this.deliveries.set(delivery.id, delivery);
      deliveries.push(delivery);

      this.trace.record({
        correlationId: event.correlationId,
        category: "delivery",
        action: "delivery-created",
        subjectId: delivery.id,
        actorIdentityId: "identity:enterprise-nervous-system",
        outcome: "pending",
        metadata: {
          eventId: event.id,
          subscriptionId: subscription.id,
          targetCapabilityId: subscription.targetCapabilityId
        }
      });
    }

    if (deliveries.length === 0) {
      this.events.updateState(event.id, "delivered");
    }

    return {
      event: this.events.get(event.id),
      matchedSubscriptions: subscriptions.length,
      deliveries
    };
  }

  acknowledge(
    deliveryId: string,
    input: {
      success: boolean;
      error?: string;
      actorIdentityId: string;
    }
  ) {
    const current = this.deliveries.get(deliveryId);

    if (!current) {
      throw new Error(`Event delivery not found: ${deliveryId}`);
    }

    const event = this.events.get(current.eventId);
    const now = new Date().toISOString();
    const attempt = current.attempt + 1;

    let updated: EventDelivery;

    if (input.success) {
      updated = {
        ...current,
        status: "delivered",
        attempt,
        error: undefined,
        deliveredAt: now,
        updatedAt: now
      };
    }
    else if (attempt >= current.maxAttempts) {
      updated = {
        ...current,
        status: "dead-lettered",
        attempt,
        error: input.error ?? "Delivery failed",
        updatedAt: now
      };

      this.deadLetters.add({
        sourceType: "event-delivery",
        sourceId: updated.id,
        correlationId: event.correlationId,
        reason: updated.error ?? "Delivery attempts exhausted",
        attempts: attempt,
        payload: {
          eventId: event.id,
          subscriptionId: updated.subscriptionId,
          targetCapabilityId: updated.targetCapabilityId,
          handlerKey: updated.handlerKey
        }
      });
    }
    else {
      updated = {
        ...current,
        status: "failed",
        attempt,
        error: input.error ?? "Delivery failed",
        updatedAt: now
      };
    }

    this.deliveries.set(deliveryId, updated);

    this.trace.record({
      correlationId: event.correlationId,
      category: "delivery",
      action: input.success ? "delivery-acknowledged" : "delivery-failed",
      subjectId: updated.id,
      actorIdentityId: input.actorIdentityId,
      outcome: input.success ? "success" : "failure",
      metadata: {
        attempt: updated.attempt,
        maxAttempts: updated.maxAttempts,
        status: updated.status,
        error: updated.error
      }
    });

    this.recalculateEventState(event.id);
    return updated;
  }

  byEvent(eventId: string) {
    return this.list().filter((delivery) => delivery.eventId === eventId);
  }

  summary() {
    const deliveries = this.list();

    return {
      total: deliveries.length,
      delivered: deliveries.filter(
        (delivery) => delivery.status === "delivered"
      ).length,
      failed: deliveries.filter(
        (delivery) => delivery.status === "failed"
      ).length,
      deadLettered: deliveries.filter(
        (delivery) => delivery.status === "dead-lettered"
      ).length,
      pending: deliveries.filter(
        (delivery) => delivery.status === "pending"
      ).length
    };
  }

  private recalculateEventState(eventId: string) {
    const deliveries = this.byEvent(eventId);

    if (deliveries.length === 0) {
      this.events.updateState(eventId, "delivered");
      return;
    }

    if (
      deliveries.every((delivery) => delivery.status === "delivered")
    ) {
      this.events.updateState(eventId, "delivered");
      return;
    }

    if (
      deliveries.every(
        (delivery) =>
          delivery.status === "dead-lettered" ||
          delivery.status === "delivered"
      ) &&
      deliveries.some(
        (delivery) => delivery.status === "dead-lettered"
      )
    ) {
      this.events.updateState(eventId, "dead-lettered");
      return;
    }

    if (
      deliveries.some((delivery) => delivery.status === "delivered")
    ) {
      this.events.updateState(eventId, "partially-delivered");
      return;
    }

    if (
      deliveries.some((delivery) => delivery.status === "failed")
    ) {
      this.events.updateState(eventId, "failed");
    }
  }
}
