import { Injectable } from "@nestjs/common";
import { KernelMessagingHealthIndex } from "../enterprise-kernel-mega-pack-5.types";
import { KernelMessageContractRegistryService } from "../contracts/kernel-message-contract-registry.service";
import { KernelDeliveryService } from "../delivery/kernel-delivery.service";
import { KernelDeadLetterService } from "../dead-letter/kernel-dead-letter.service";
import { KernelOrchestrationService } from "../orchestration/kernel-orchestration.service";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelMessagingHealthService {
  private readonly indexes = new Map<string, KernelMessagingHealthIndex>();

  constructor(
    private readonly contracts: KernelMessageContractRegistryService,
    private readonly delivery: KernelDeliveryService,
    private readonly deadLetters: KernelDeadLetterService,
    private readonly orchestration: KernelOrchestrationService,
    private readonly audit: KernelMessagingAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const contractSummary = this.contracts.summary();
    const deliverySummary = this.delivery.summary();
    const deadLetterSummary = this.deadLetters.summary();
    const orchestrationSummary = this.orchestration.summary();
    const auditSummary = this.audit.summary();

    const contractScore =
      contractSummary.total >= 4 &&
      contractSummary.active === contractSummary.total
        ? 100
        : 70;

    const deliveryScore =
      deliverySummary.total === 0
        ? 100
        : Number(
            (
              deliverySummary.delivered /
              deliverySummary.total *
              100
            ).toFixed(2)
          );

    const retryScore =
      deliverySummary.failed === 0 ? 100 : 70;

    const deadLetterScore =
      deadLetterSummary.total === 0
        ? 100
        : Number(
            (
              deadLetterSummary.replayed /
              deadLetterSummary.total *
              100
            ).toFixed(2)
          );

    const orchestrationScore =
      orchestrationSummary.total === 0
        ? 100
        : Number(
            (
              (
                orchestrationSummary.completed +
                orchestrationSummary.compensated
              ) /
              orchestrationSummary.total *
              100
            ).toFixed(2)
          );

    const traceabilityScore =
      auditSummary.total > 0 || orchestrationSummary.traces > 0
        ? 100
        : 80;

    const score = Number(
      (
        contractScore * 0.2 +
        deliveryScore * 0.2 +
        retryScore * 0.1 +
        deadLetterScore * 0.1 +
        orchestrationScore * 0.3 +
        traceabilityScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (contractScore < 90) reasons.push("Kernel message contract coverage is incomplete.");
    if (deliveryScore < 90) reasons.push("Kernel message delivery reliability is below target.");
    if (deadLetterScore < 90) reasons.push("Kernel dead letters require replay.");
    if (orchestrationScore < 90) reasons.push("Kernel orchestration execution requires attention.");

    if (reasons.length === 0) {
      reasons.push("Kernel messaging and orchestration are healthy.");
    }

    const index: KernelMessagingHealthIndex = {
      id: `kernel-messaging-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        contractScore,
        deliveryScore,
        retryScore,
        deadLetterScore,
        orchestrationScore,
        traceabilityScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "kernel-messaging-health-calculated",
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
      healthy: items.filter(
        (item) =>
          item.level === "healthy" ||
          item.level === "excellent"
      ).length
    };
  }

  private level(score: number): KernelMessagingHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
