import { Injectable } from "@nestjs/common";
import { NervousRoutingHealthIndex } from "../enterprise-nervous-system-mega-pack-2.types";
import { NervousSignalRegistryService } from "../signals/nervous-signal-registry.service";
import { NervousTopicTaxonomyService } from "../taxonomy/nervous-topic-taxonomy.service";
import { NervousSubscriptionRegistryService } from "../subscriptions/nervous-subscription-registry.service";
import { NervousDeliveryPolicyService } from "../policies/nervous-delivery-policy.service";
import { NervousIntelligentRoutingService } from "../routing/nervous-intelligent-routing.service";
import { NervousThrottlingService } from "../throttling/nervous-throttling.service";
import { NervousFanoutService } from "../fanout/nervous-fanout.service";
import { NervousRoutingAuditService } from "../observability/nervous-routing-audit.service";

@Injectable()
export class NervousRoutingHealthService {
  private readonly indexes =
    new Map<string, NervousRoutingHealthIndex>();

  constructor(
    private readonly signals: NervousSignalRegistryService,
    private readonly taxonomy: NervousTopicTaxonomyService,
    private readonly subscriptions: NervousSubscriptionRegistryService,
    private readonly policies: NervousDeliveryPolicyService,
    private readonly routing: NervousIntelligentRoutingService,
    private readonly throttling: NervousThrottlingService,
    private readonly fanout: NervousFanoutService,
    private readonly audit: NervousRoutingAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const signals = this.signals.summary();
    const taxonomy = this.taxonomy.summary();
    const subscriptions = this.subscriptions.summary();
    const policies = this.policies.summary();
    const routing = this.routing.summary();
    const throttling = this.throttling.summary();
    const fanout = this.fanout.summary();

    const signalRegistryScore =
      signals.total >= 3 &&
      signals.active === signals.total
        ? 100
        : 70;

    const taxonomyScore =
      taxonomy.total >= 4 &&
      taxonomy.roots >= 1
        ? 100
        : 70;

    const subscriptionScore =
      subscriptions.total >= 2 &&
      subscriptions.degraded === 0 &&
      subscriptions.disabled === 0
        ? 100
        : 70;

    const policyScore =
      policies.total >= 2 &&
      policies.active === policies.total
        ? 100
        : 70;

    const routingScore =
      routing.routing.total === 0
        ? 100
        : Math.max(
            0,
            100 -
            routing.routing.blockedTargets * 10 -
            routing.routing.approvalTargets * 5
          );

    const throttlingScore =
      throttling.saturated === 0
        ? 100
        : Math.max(
            0,
            100 - throttling.saturated * 20
          );

    const fanoutScore =
      fanout.failed === 0
        ? fanout.partial === 0
          ? 100
          : Math.max(0, 100 - fanout.partial * 10)
        : Math.max(0, 100 - fanout.failed * 25);

    const score = Number(
      (
        signalRegistryScore * 0.15 +
        taxonomyScore * 0.1 +
        subscriptionScore * 0.15 +
        policyScore * 0.1 +
        routingScore * 0.25 +
        throttlingScore * 0.1 +
        fanoutScore * 0.15
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (signalRegistryScore < 90) {
      reasons.push("Signal registry coverage is incomplete.");
    }

    if (taxonomyScore < 90) {
      reasons.push("Topic taxonomy coverage is incomplete.");
    }

    if (subscriptionScore < 90) {
      reasons.push("Subscription registry health is below target.");
    }

    if (policyScore < 90) {
      reasons.push("Delivery policy coverage is incomplete.");
    }

    if (routingScore < 90) {
      reasons.push("Routing decisions include blocks or approvals.");
    }

    if (throttlingScore < 90) {
      reasons.push("Subscription throttling is saturated.");
    }

    if (fanoutScore < 90) {
      reasons.push("Fan-out batches contain partial or failed delivery.");
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Nervous System routing core is healthy."
      );
    }

    const index: NervousRoutingHealthIndex = {
      id: `nervous-routing-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        signalRegistryScore,
        taxonomyScore,
        subscriptionScore,
        policyScore,
        routingScore,
        throttlingScore,
        fanoutScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "nervous-routing-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy:
        items.filter(
          (x) =>
            x.level === "healthy" ||
            x.level === "excellent"
        ).length
    };
  }

  private level(
    score: number
  ): NervousRoutingHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
