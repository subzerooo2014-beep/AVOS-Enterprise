import { Injectable } from "@nestjs/common";
import { NervousSystemCorrelationTrace } from "../enterprise-nervous-system-mega-pack-1.types";

@Injectable()
export class NervousSystemCorrelationService {
  private readonly traces =
    new Map<string, NervousSystemCorrelationTrace>();

  list() {
    return Array.from(this.traces.values());
  }

  getOrCreate(
    correlationId: string,
    traceId: string
  ) {
    const existing = this.list().find(
      (trace) =>
        trace.correlationId === correlationId &&
        trace.traceId === traceId
    );

    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();

    const trace: NervousSystemCorrelationTrace = {
      id: `nervous-trace:${Date.now()}:${this.traces.size + 1}`,
      correlationId,
      traceId,
      eventIds: [],
      deliveryIds: [],
      failedDeliveryIds: [],
      startedAt: now,
      updatedAt: now
    };

    this.traces.set(trace.id, trace);
    return trace;
  }

  attachEvent(
    correlationId: string,
    traceId: string,
    eventId: string
  ) {
    const current = this.getOrCreate(correlationId, traceId);

    const updated: NervousSystemCorrelationTrace = {
      ...current,
      eventIds: Array.from(new Set([
        ...current.eventIds,
        eventId
      ])),
      updatedAt: new Date().toISOString()
    };

    this.traces.set(updated.id, updated);
    return updated;
  }

  attachDelivery(
    correlationId: string,
    traceId: string,
    deliveryId: string,
    failed: boolean
  ) {
    const current = this.getOrCreate(correlationId, traceId);

    const updated: NervousSystemCorrelationTrace = {
      ...current,
      deliveryIds: Array.from(new Set([
        ...current.deliveryIds,
        deliveryId
      ])),
      failedDeliveryIds: failed
        ? Array.from(new Set([
            ...current.failedDeliveryIds,
            deliveryId
          ]))
        : current.failedDeliveryIds,
      updatedAt: new Date().toISOString()
    };

    this.traces.set(updated.id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      events: items.reduce(
        (sum, item) => sum + item.eventIds.length,
        0
      ),
      deliveries: items.reduce(
        (sum, item) => sum + item.deliveryIds.length,
        0
      ),
      failures: items.reduce(
        (sum, item) => sum + item.failedDeliveryIds.length,
        0
      )
    };
  }
}
