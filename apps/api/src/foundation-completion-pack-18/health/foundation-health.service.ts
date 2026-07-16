import { Injectable } from "@nestjs/common";
import {
  FoundationHealthIndex
} from "../foundation-pack-18.types";
import { FoundationComponentRegistryService } from "../registry/foundation-component-registry.service";
import { FoundationSelfValidationService } from "../validation/foundation-self-validation.service";
import { FoundationConsistencyService } from "../consistency/foundation-consistency.service";
import { FoundationMaturityService } from "../maturity/foundation-maturity.service";
import { FoundationReadinessService } from "../readiness/foundation-readiness.service";
import { FoundationValidationAuditService } from "../observability/foundation-validation-audit.service";

@Injectable()
export class FoundationHealthService {
  private readonly indexes =
    new Map<string, FoundationHealthIndex>();

  constructor(
    private readonly registry: FoundationComponentRegistryService,
    private readonly validation: FoundationSelfValidationService,
    private readonly consistency: FoundationConsistencyService,
    private readonly maturity: FoundationMaturityService,
    private readonly readiness: FoundationReadinessService,
    private readonly audit: FoundationValidationAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const registry = this.registry.summary();
    const validation = this.validation.summary();
    const maturity = this.maturity.summary();
    const readiness = this.readiness.summary();
    const consistency =
      this.consistency.check(input);

    const componentCoverageScore =
      registry.required === 0
        ? 100
        : Number(
            (
              registry.present /
              registry.required *
              100
            ).toFixed(2)
          );

    const validationScore = Math.max(
      0,
      100 -
        validation.critical * 30 -
        validation.errors * 15 -
        validation.warnings * 5
    );

    const consistencyScore =
      consistency.consistent ? 100 : 40;

    const maturityScore = maturity.latestScore;

    const readinessScore = readiness.latestScore;

    const score = Number(
      (
        componentCoverageScore * 0.25 +
        validationScore * 0.2 +
        consistencyScore * 0.2 +
        maturityScore * 0.15 +
        readinessScore * 0.2
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (componentCoverageScore < 100) {
      reasons.push(
        "Foundation component coverage is incomplete."
      );
    }

    if (validationScore < 80) {
      reasons.push(
        "Foundation validation contains unresolved findings."
      );
    }

    if (consistencyScore < 80) {
      reasons.push(
        "Foundation consistency requires correction."
      );
    }

    if (maturityScore < 75) {
      reasons.push(
        "Foundation maturity is below managed level."
      );
    }

    if (readinessScore < 80) {
      reasons.push(
        "Foundation readiness is below the required threshold."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Foundation is healthy and ready."
      );
    }

    const index: FoundationHealthIndex = {
      id: `foundation-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        componentCoverageScore,
        validationScore,
        consistencyScore,
        maturityScore,
        readinessScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "foundation-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score < 60 ? "warning" : "success",
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

  private level(
    score: number
  ): FoundationHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
