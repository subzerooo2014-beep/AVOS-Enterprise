import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousSubscription } from "../enterprise-nervous-system-mega-pack-2.types";
import { NervousSignalRegistryService } from "../signals/nervous-signal-registry.service";
import { NervousDeliveryPolicyService } from "../policies/nervous-delivery-policy.service";
import { NervousRoutingAuditService } from "../observability/nervous-routing-audit.service";

@Injectable()
export class NervousSubscriptionRegistryService {
  private readonly subscriptions =
    new Map<string, NervousSubscription>();

  constructor(
    private readonly signals: NervousSignalRegistryService,
    private readonly policies: NervousDeliveryPolicyService,
    private readonly audit: NervousRoutingAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.subscriptions.values());
  }

  get(id: string) {
    const subscription = this.subscriptions.get(id);

    if (!subscription) {
      throw new NotFoundException(`Nervous subscription not found: ${id}`);
    }

    return subscription;
  }

  register(
    input: Omit<NervousSubscription, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.subscriptions.has(input.id)) {
      throw new ConflictException(
        `Nervous subscription already exists: ${input.id}`
      );
    }

    for (const signalId of input.signalDefinitionIds) {
      this.signals.get(signalId);
    }

    this.policies.get(input.deliveryPolicyId);

    const now = new Date().toISOString();

    const subscription: NervousSubscription = {
      ...input,
      topicPatterns:
        Array.from(new Set(input.topicPatterns)),
      signalDefinitionIds:
        Array.from(new Set(input.signalDefinitionIds)),
      filters:
        input.filters.map((filter) => ({ ...filter })),
      priority: Math.max(0, Math.min(100, input.priority)),
      maxRatePerMinute: Math.max(1, input.maxRatePerMinute),
      createdAt: now,
      updatedAt: now
    };

    this.subscriptions.set(subscription.id, subscription);

    this.audit.record({
      correlationId: context.correlationId,
      category: "subscription",
      action: "nervous-subscription-registered",
      subjectId: subscription.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        consumerId: subscription.consumerId,
        priority: subscription.priority
      }
    });

    return subscription;
  }

  active() {
    return this.list().filter((item) => item.status === "active");
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.status === "active").length,
      paused: items.filter((x) => x.status === "paused").length,
      degraded: items.filter((x) => x.status === "degraded").length,
      disabled: items.filter((x) => x.status === "disabled").length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const items: NervousSubscription[] = [
      {
        id: "subscription:enterprise-brain-health",
        name: "Enterprise Brain Health Subscription",
        consumerId: "consumer:enterprise-brain",
        topicPatterns: ["avos.system.*"],
        signalDefinitionIds: ["signal:platform-health"],
        filters: [],
        priority: 80,
        maxRatePerMinute: 600,
        deliveryPolicyId: "delivery-policy:standard",
        status: "active",
        requiresHumanApprovalForCritical: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "subscription:enterprise-kernel-decisions",
        name: "Enterprise Kernel Decision Subscription",
        consumerId: "consumer:enterprise-kernel",
        topicPatterns: ["avos.brain.*", "avos.governance.*"],
        signalDefinitionIds: [
          "signal:brain-decision",
          "signal:critical-governance"
        ],
        filters: [],
        priority: 100,
        maxRatePerMinute: 300,
        deliveryPolicyId: "delivery-policy:critical",
        status: "active",
        requiresHumanApprovalForCritical: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const item of items) {
      this.subscriptions.set(item.id, item);
    }
  }
}
