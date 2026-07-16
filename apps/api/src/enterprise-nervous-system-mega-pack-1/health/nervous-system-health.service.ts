import { Injectable } from "@nestjs/common";
import { NervousSystemHealthIndex } from "../enterprise-nervous-system-mega-pack-1.types";
import { NervousSystemContractRegistryService } from "../contracts/nervous-system-contract-registry.service";
import { NervousSystemTopicRegistryService } from "../topics/nervous-system-topic-registry.service";
import { NervousSystemEndpointRegistryService } from "../producers/nervous-system-endpoint-registry.service";
import { NervousSystemDeliveryService } from "../delivery/nervous-system-delivery.service";
import { NervousSystemRetryService } from "../retry/nervous-system-retry.service";
import { NervousSystemDeadLetterService } from "../dead-letter/nervous-system-dead-letter.service";
import { NervousSystemCorrelationService } from "../correlation/nervous-system-correlation.service";
import { NervousSystemAuditService } from "../observability/nervous-system-audit.service";

@Injectable()
export class NervousSystemHealthService {
  private readonly indexes =
    new Map<string, NervousSystemHealthIndex>();

  constructor(
    private readonly contracts: NervousSystemContractRegistryService,
    private readonly topics: NervousSystemTopicRegistryService,
    private readonly endpoints: NervousSystemEndpointRegistryService,
    private readonly deliveries: NervousSystemDeliveryService,
    private readonly retry: NervousSystemRetryService,
    private readonly deadLetters: NervousSystemDeadLetterService,
    private readonly traces: NervousSystemCorrelationService,
    private readonly audit: NervousSystemAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const contracts = this.contracts.summary();
    const topics = this.topics.summary();
    const endpoints = this.endpoints.summary();
    const deliveries = this.deliveries.summary();
    const retry = this.retry.summary();
    const deadLetters = this.deadLetters.summary();
    const traces = this.traces.summary();

    const contractsScore =
      contracts.total >= 2 &&
      contracts.active === contracts.total &&
      contracts.traceable === contracts.total
        ? 100
        : 70;

    const topicsScore =
      topics.total >= 3 &&
      topics.active === topics.total
        ? 100
        : 70;

    const producersScore =
      endpoints.producers.total >= 2 &&
      endpoints.producers.active === endpoints.producers.total
        ? 100
        : 70;

    const consumersScore =
      endpoints.consumers.total >= 2 &&
      endpoints.consumers.degraded === 0 &&
      endpoints.consumers.offline === 0
        ? 100
        : 70;

    const deliveryScore =
      deliveries.total === 0
        ? 100
        : Number(
            (
              deliveries.delivered /
              deliveries.total *
              100
            ).toFixed(2)
          );

    const retryScore =
      retry.exhausted === 0
        ? 100
        : Math.max(
            0,
            100 - retry.exhausted * 20
          );

    const deadLetterScore =
      deadLetters.pendingReplay === 0
        ? 100
        : Math.max(
            0,
            100 - deadLetters.pendingReplay * 15
          );

    const traceScore =
      traces.failures === 0
        ? 100
        : Math.max(
            0,
            100 - traces.failures * 10
          );

    const score = Number(
      (
        contractsScore * 0.15 +
        topicsScore * 0.1 +
        producersScore * 0.1 +
        consumersScore * 0.1 +
        deliveryScore * 0.2 +
        retryScore * 0.1 +
        deadLetterScore * 0.1 +
        traceScore * 0.15
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (contractsScore < 90) {
      reasons.push("Event contract registry coverage is incomplete.");
    }

    if (topicsScore < 90) {
      reasons.push("Topic registry coverage is incomplete.");
    }

    if (producersScore < 90) {
      reasons.push("Producer registry coverage is incomplete.");
    }

    if (consumersScore < 90) {
      reasons.push("Consumer availability is below target.");
    }

    if (deliveryScore < 90) {
      reasons.push("Event delivery success is below target.");
    }

    if (retryScore < 90) {
      reasons.push("Retry exhaustion requires attention.");
    }

    if (deadLetterScore < 90) {
      reasons.push("Dead letters are pending replay.");
    }

    if (traceScore < 90) {
      reasons.push("Correlation traces contain failures.");
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Nervous System messaging core is healthy."
      );
    }

    const index: NervousSystemHealthIndex = {
      id: `nervous-system-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        contractsScore,
        topicsScore,
        producersScore,
        consumersScore,
        deliveryScore,
        retryScore,
        deadLetterScore,
        traceScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "nervous-system-health-calculated",
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
  ): NervousSystemHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
