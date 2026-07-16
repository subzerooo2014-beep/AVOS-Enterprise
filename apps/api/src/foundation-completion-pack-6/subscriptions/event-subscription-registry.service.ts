import { Injectable, NotFoundException } from "@nestjs/common";
import { EventSubscription } from "../foundation-pack-6.types";

@Injectable()
export class EventSubscriptionRegistryService {
  private readonly subscriptions = new Map<string, EventSubscription>();

  list() {
    return Array.from(this.subscriptions.values()).sort(
      (left, right) => right.priority - left.priority
    );
  }

  get(id: string) {
    const subscription = this.subscriptions.get(id);

    if (!subscription) {
      throw new NotFoundException(`Event subscription not found: ${id}`);
    }

    return subscription;
  }

  register(
    input: Omit<EventSubscription, "createdAt" | "updatedAt">
  ) {
    const now = new Date().toISOString();

    const subscription: EventSubscription = {
      ...input,
      eventTypePattern: input.eventTypePattern.trim(),
      maxAttempts: Math.max(1, Math.round(input.maxAttempts)),
      priority: Math.round(input.priority),
      createdAt: now,
      updatedAt: now
    };

    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  setActive(id: string, active: boolean) {
    const current = this.get(id);
    const updated: EventSubscription = {
      ...current,
      active,
      updatedAt: new Date().toISOString()
    };

    this.subscriptions.set(id, updated);
    return updated;
  }

  matching(eventType: string) {
    return this.list().filter(
      (subscription) =>
        subscription.active &&
        this.matches(subscription.eventTypePattern, eventType)
    );
  }

  summary() {
    const subscriptions = this.list();

    return {
      total: subscriptions.length,
      active: subscriptions.filter(
        (subscription) => subscription.active
      ).length,
      humanApprovalRequired: subscriptions.filter(
        (subscription) => subscription.requiresHumanApproval
      ).length
    };
  }

  private matches(pattern: string, eventType: string) {
    if (pattern === "*") {
      return true;
    }

    if (pattern.endsWith("*")) {
      return eventType.startsWith(pattern.slice(0, -1));
    }

    return pattern === eventType;
  }
}
