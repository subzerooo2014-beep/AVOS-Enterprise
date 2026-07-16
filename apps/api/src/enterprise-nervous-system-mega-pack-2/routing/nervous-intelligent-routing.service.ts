import {
  ConflictException,
  Injectable
} from "@nestjs/common";
import {
  NervousRouteTarget,
  NervousRoutingResult,
  NervousSignalEnvelope
} from "../enterprise-nervous-system-mega-pack-2.types";
import { NervousSignalRegistryService } from "../signals/nervous-signal-registry.service";
import { NervousTopicTaxonomyService } from "../taxonomy/nervous-topic-taxonomy.service";
import { NervousSubscriptionRegistryService } from "../subscriptions/nervous-subscription-registry.service";
import { NervousFilterEngineService } from "../filters/nervous-filter-engine.service";
import { NervousThrottlingService } from "../throttling/nervous-throttling.service";
import { NervousFanoutService } from "../fanout/nervous-fanout.service";
import { NervousRoutingAuditService } from "../observability/nervous-routing-audit.service";

@Injectable()
export class NervousIntelligentRoutingService {
  private readonly signals =
    new Map<string, NervousSignalEnvelope>();

  private readonly results =
    new Map<string, NervousRoutingResult>();

  constructor(
    private readonly definitions: NervousSignalRegistryService,
    private readonly taxonomy: NervousTopicTaxonomyService,
    private readonly subscriptions: NervousSubscriptionRegistryService,
    private readonly filters: NervousFilterEngineService,
    private readonly throttling: NervousThrottlingService,
    private readonly fanout: NervousFanoutService,
    private readonly audit: NervousRoutingAuditService
  ) {}

  listSignals() {
    return Array.from(this.signals.values());
  }

  listResults() {
    return Array.from(this.results.values());
  }

  createSignal(input: {
    definitionId: string;
    sourceId: string;
    payload: unknown;
    headers?: Record<string, string>;
    correlationId: string;
    traceId?: string;
    causationId?: string;
    ttlSeconds?: number;
    actorIdentityId: string;
  }) {
    const definition = this.definitions.get(input.definitionId);

    if (!definition.active) {
      throw new ConflictException(
        `Signal definition is inactive: ${definition.id}`
      );
    }

    const signal: NervousSignalEnvelope = {
      id: `nervous-signal:${Date.now()}:${this.signals.size + 1}`,
      definitionId: definition.id,
      topic: definition.topic,
      sourceId: input.sourceId,
      payload: input.payload,
      headers: {
        ...definition.defaultHeaders,
        ...(input.headers ?? {}),
        "x-avos-correlation-id": input.correlationId,
        "x-avos-trace-id":
          input.traceId ?? `nervous-routing-trace:${Date.now()}`
      },
      severity: definition.severity,
      status: "created",
      correlationId: input.correlationId,
      traceId:
        input.traceId ?? `nervous-routing-trace:${Date.now()}`,
      causationId: input.causationId,
      expiresAt:
        input.ttlSeconds
          ? new Date(
              Date.now() + input.ttlSeconds * 1000
            ).toISOString()
          : undefined,
      createdAt: new Date().toISOString()
    };

    this.signals.set(signal.id, signal);

    this.audit.record({
      correlationId: signal.correlationId,
      category: "signal",
      action: "nervous-signal-created",
      subjectId: signal.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        definitionId: signal.definitionId,
        topic: signal.topic,
        severity: signal.severity
      }
    });

    return signal;
  }

  route(input: {
    signalId: string;
    humanApproved: boolean;
    actorIdentityId: string;
  }) {
    const signal = this.signals.get(input.signalId);

    if (!signal) {
      throw new Error(`Nervous signal not found: ${input.signalId}`);
    }

    if (
      signal.expiresAt &&
      new Date(signal.expiresAt).getTime() <= Date.now()
    ) {
      const expired: NervousSignalEnvelope = {
        ...signal,
        status: "expired"
      };

      this.signals.set(expired.id, expired);
      throw new ConflictException("Nervous signal has expired.");
    }

    const definition = this.definitions.get(signal.definitionId);
    this.taxonomy.match(signal.topic);

    const matched = this.subscriptions.active()
      .filter(
        (subscription) =>
          subscription.signalDefinitionIds.length === 0 ||
          subscription.signalDefinitionIds.includes(signal.definitionId)
      )
      .filter(
        (subscription) =>
          subscription.topicPatterns.some(
            (pattern) => this.topicMatches(pattern, signal.topic)
          )
      );

    const targets: NervousRouteTarget[] = [];

    for (const subscription of matched) {
      const filterResult = this.filters.evaluate(
        signal,
        subscription.filters
      );

      if (!filterResult.passed) {
        targets.push({
          subscriptionId: subscription.id,
          consumerId: subscription.consumerId,
          decision: "block",
          priority: subscription.priority,
          reasons: ["Subscription filters rejected signal."],
          deliveryPolicyId: subscription.deliveryPolicyId
        });
        continue;
      }

      if (
        (
          definition.requiresHumanApproval ||
          signal.severity === "critical" ||
          subscription.requiresHumanApprovalForCritical
        ) &&
        !input.humanApproved
      ) {
        targets.push({
          subscriptionId: subscription.id,
          consumerId: subscription.consumerId,
          decision: "require-human-approval",
          priority: subscription.priority,
          reasons: ["Critical signal requires human approval."],
          deliveryPolicyId: subscription.deliveryPolicyId
        });
        continue;
      }

      const throttle = this.throttling.consume({
        subscriptionId: subscription.id,
        limit: subscription.maxRatePerMinute,
        correlationId: signal.correlationId,
        actorIdentityId: input.actorIdentityId
      });

      if (!throttle.allowed) {
        targets.push({
          subscriptionId: subscription.id,
          consumerId: subscription.consumerId,
          decision: "throttle",
          priority: subscription.priority,
          reasons: ["Subscription rate limit exceeded."],
          deliveryPolicyId: subscription.deliveryPolicyId
        });
        continue;
      }

      targets.push({
        subscriptionId: subscription.id,
        consumerId: subscription.consumerId,
        decision: "deliver",
        priority: subscription.priority,
        reasons: ["Signal matched subscription and routing policy."],
        deliveryPolicyId: subscription.deliveryPolicyId
      });
    }

    targets.sort((left, right) => right.priority - left.priority);

    const result: NervousRoutingResult = {
      id: `nervous-routing-result:${Date.now()}:${this.results.size + 1}`,
      signalId: signal.id,
      targets,
      deliveredTargets:
        targets.filter((x) => x.decision === "deliver").length,
      blockedTargets:
        targets.filter((x) => x.decision === "block").length,
      throttledTargets:
        targets.filter((x) => x.decision === "throttle").length,
      approvalTargets:
        targets.filter(
          (x) => x.decision === "require-human-approval"
        ).length,
      correlationId: signal.correlationId,
      createdAt: new Date().toISOString()
    };

    this.results.set(result.id, result);

    const deliverTargets = targets
      .filter((target) => target.decision === "deliver")
      .map((target) => target.subscriptionId);

    const batch = this.fanout.create({
      signalId: signal.id,
      targetSubscriptionIds: deliverTargets,
      correlationId: signal.correlationId,
      actorIdentityId: input.actorIdentityId
    });

    this.fanout.complete({
      batchId: batch.id,
      completedSubscriptionIds: deliverTargets,
      failedSubscriptionIds: []
    });

    const routedSignal: NervousSignalEnvelope = {
      ...signal,
      status:
        result.approvalTargets > 0
          ? "blocked"
          : "routed"
    };

    this.signals.set(routedSignal.id, routedSignal);

    this.audit.record({
      correlationId: signal.correlationId,
      category: "routing",
      action: "nervous-signal-routed",
      subjectId: result.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        result.approvalTargets > 0 ||
        result.blockedTargets > 0
          ? "warning"
          : "success",
      metadata: {
        deliveredTargets: result.deliveredTargets,
        blockedTargets: result.blockedTargets,
        throttledTargets: result.throttledTargets,
        approvalTargets: result.approvalTargets
      }
    });

    return {
      signal: routedSignal,
      routing: result
    };
  }

  summary() {
    const signals = this.listSignals();
    const results = this.listResults();

    return {
      signals: {
        total: signals.length,
        routed: signals.filter((x) => x.status === "routed").length,
        blocked: signals.filter((x) => x.status === "blocked").length,
        expired: signals.filter((x) => x.status === "expired").length
      },
      routing: {
        total: results.length,
        deliveredTargets:
          results.reduce(
            (sum, item) => sum + item.deliveredTargets,
            0
          ),
        blockedTargets:
          results.reduce(
            (sum, item) => sum + item.blockedTargets,
            0
          ),
        throttledTargets:
          results.reduce(
            (sum, item) => sum + item.throttledTargets,
            0
          ),
        approvalTargets:
          results.reduce(
            (sum, item) => sum + item.approvalTargets,
            0
          )
      }
    };
  }

  private topicMatches(pattern: string, topic: string) {
    if (pattern === topic) return true;

    if (pattern.endsWith(".*")) {
      return topic.startsWith(pattern.slice(0, -1));
    }

    return false;
  }
}
