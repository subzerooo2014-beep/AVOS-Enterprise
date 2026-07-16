import { Injectable } from "@nestjs/common";
import {
  KernelDeliveryAttempt,
  KernelMessageEnvelope,
  KernelSubscription
} from "../enterprise-kernel-mega-pack-5.types";
import { KernelSubscriptionRegistryService } from "./kernel-subscription-registry.service";
import { KernelDeadLetterService } from "../dead-letter/kernel-dead-letter.service";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelDeliveryService {
  private readonly attempts: KernelDeliveryAttempt[] = [];

  constructor(
    private readonly subscriptions: KernelSubscriptionRegistryService,
    private readonly deadLetters: KernelDeadLetterService,
    private readonly audit: KernelMessagingAuditService
  ) {}

  listAttempts() {
    return [...this.attempts];
  }

  deliver(input: {
    message: KernelMessageEnvelope;
    actorIdentityId: string;
    simulateFailureForConsumerIds?: string[];
  }) {
    const subscriptions = this.subscriptions.byContract(
      input.message.contractId
    );

    const results = subscriptions.map((subscription) =>
      this.deliverToSubscription({
        message: input.message,
        subscription,
        actorIdentityId: input.actorIdentityId,
        simulateFailure:
          input.simulateFailureForConsumerIds?.includes(
            subscription.consumerId
          ) ?? false
      })
    );

    return {
      messageId: input.message.id,
      subscriptions: subscriptions.length,
      delivered: results.filter((x) => x.status === "delivered").length,
      failed: results.filter((x) => x.status === "failed").length,
      deadLettered: results.filter((x) => x.status === "dead-lettered").length,
      attempts: results
    };
  }

  private deliverToSubscription(input: {
    message: KernelMessageEnvelope;
    subscription: KernelSubscription;
    actorIdentityId: string;
    simulateFailure: boolean;
  }) {
    let lastAttempt: KernelDeliveryAttempt | undefined;

    for (
      let attemptNumber = 1;
      attemptNumber <= Math.max(1, input.subscription.maxRetries + 1);
      attemptNumber += 1
    ) {
      const attempt: KernelDeliveryAttempt = {
        id: `kernel-delivery-attempt:${Date.now()}:${this.attempts.length + 1}`,
        messageId: input.message.id,
        subscriptionId: input.subscription.id,
        attempt: attemptNumber,
        status: "pending",
        startedAt: new Date().toISOString()
      };

      if (!input.simulateFailure) {
        attempt.status = "delivered";
        attempt.completedAt = new Date().toISOString();
        this.attempts.push(attempt);

        this.audit.record({
          correlationId: input.message.correlationId,
          category: "delivery",
          action: "kernel-message-delivered",
          subjectId: attempt.id,
          actorIdentityId: input.actorIdentityId,
          outcome: "success",
          metadata: {
            consumerId: input.subscription.consumerId,
            attempt: attemptNumber
          }
        });

        return attempt;
      }

      attempt.status = "failed";
      attempt.error = "Simulated consumer delivery failure.";
      attempt.completedAt = new Date().toISOString();
      this.attempts.push(attempt);
      lastAttempt = attempt;
    }

    const deadLetter = this.deadLetters.add({
      messageId: input.message.id,
      subscriptionId: input.subscription.id,
      reason: lastAttempt?.error ?? "Delivery failed.",
      attempts: lastAttempt?.attempt ?? 1,
      actorIdentityId: input.actorIdentityId,
      correlationId: input.message.correlationId
    });

    const finalAttempt: KernelDeliveryAttempt = {
      id: `kernel-delivery-attempt:${Date.now()}:${this.attempts.length + 1}`,
      messageId: input.message.id,
      subscriptionId: input.subscription.id,
      attempt: lastAttempt?.attempt ?? 1,
      status: "dead-lettered",
      error: deadLetter.reason,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    this.attempts.push(finalAttempt);
    return finalAttempt;
  }

  summary() {
    return {
      total: this.attempts.length,
      delivered: this.attempts.filter((x) => x.status === "delivered").length,
      failed: this.attempts.filter((x) => x.status === "failed").length,
      deadLettered: this.attempts.filter((x) => x.status === "dead-lettered").length
    };
  }
}
