import { Injectable } from "@nestjs/common";
import { NervousSystemEventEnvelope } from "../enterprise-nervous-system-mega-pack-1.types";
import { NervousSystemDeliveryService } from "../delivery/nervous-system-delivery.service";
import { NervousSystemDeadLetterService } from "../dead-letter/nervous-system-dead-letter.service";
import { NervousSystemAuditService } from "../observability/nervous-system-audit.service";

@Injectable()
export class NervousSystemRetryService {
  constructor(
    private readonly deliveries: NervousSystemDeliveryService,
    private readonly deadLetters: NervousSystemDeadLetterService,
    private readonly audit: NervousSystemAuditService
  ) {}

  retry(input: {
    deliveryId: string;
    event: NervousSystemEventEnvelope;
    actorIdentityId: string;
  }) {
    const current = this.deliveries.get(input.deliveryId);

    if (
      current.status !== "retrying" &&
      current.status !== "failed"
    ) {
      return current;
    }

    const result = this.deliveries.deliver(
      current.id,
      input.event
    );

    if (
      result.status === "failed" &&
      result.attempt >= result.maxAttempts
    ) {
      this.deadLetters.add({
        eventId: input.event.id,
        consumerId: result.consumerId,
        deliveryId: result.id,
        reason: result.error ?? "Maximum attempts exceeded.",
        payloadSnapshot: input.event.payload,
        actorIdentityId: input.actorIdentityId,
        correlationId: input.event.correlationId
      });
    }

    this.audit.record({
      correlationId: input.event.correlationId,
      category: "retry",
      action: "nervous-system-delivery-retried",
      subjectId: result.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        result.status === "delivered"
          ? "success"
          : result.status === "failed"
            ? "failure"
            : "warning",
      metadata: {
        attempt: result.attempt,
        maxAttempts: result.maxAttempts
      }
    });

    return result;
  }

  summary() {
    const deliveries = this.deliveries.list();

    return {
      retrying:
        deliveries.filter((x) => x.status === "retrying").length,
      exhausted:
        deliveries.filter(
          (x) =>
            x.status === "failed" &&
            x.attempt >= x.maxAttempts
        ).length
    };
  }
}
