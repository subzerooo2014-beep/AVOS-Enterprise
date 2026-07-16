import { Injectable } from "@nestjs/common";
import {
  FoundationHealthIndex
} from "../foundation-pack-10.types";
import { LivingBlueprintRegistryService } from "../blueprints/living-blueprint-registry.service";
import { ArchitectureDriftDetectorService } from "../drift/architecture-drift-detector.service";
import { ArchitectureRuleEngineService } from "../rules/architecture-rule-engine.service";
import { DependencyHealthAnalyzerService } from "./dependency-health-analyzer.service";
import { ArchitectureCompatibilityValidatorService } from "../compatibility/architecture-compatibility-validator.service";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class FoundationHealthIndexService {
  private readonly indexes =
    new Map<string, FoundationHealthIndex>();

  constructor(
    private readonly blueprints: LivingBlueprintRegistryService,
    private readonly drift: ArchitectureDriftDetectorService,
    private readonly rules: ArchitectureRuleEngineService,
    private readonly dependencyHealth: DependencyHealthAnalyzerService,
    private readonly compatibility: ArchitectureCompatibilityValidatorService,
    private readonly audit: ArchitectureAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    blueprintId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const blueprint = this.blueprints.get(
      input.blueprintId
    );

    const driftSummary = this.drift.summary();
    const ruleSummary = this.rules.summary();
    const dependencySummary =
      this.dependencyHealth.summary();
    const compatibilitySummary =
      this.compatibility.summary();

    const driftScore = this.clamp(
      100 -
        driftSummary.critical * 30 -
        driftSummary.high * 15 -
        driftSummary.medium * 7 -
        driftSummary.low * 2
    );

    const ruleComplianceScore = this.clamp(
      100 -
        ruleSummary.criticalFindings * 30 -
        ruleSummary.errorFindings * 15 -
        Math.max(
          0,
          ruleSummary.findings -
            ruleSummary.criticalFindings -
            ruleSummary.errorFindings
        ) *
          5
    );

    const dependencyHealthScore = this.clamp(
      100 -
        dependencySummary.critical * 30 -
        dependencySummary.errors * 15 -
        dependencySummary.warnings * 5
    );

    const compatibilityScore =
      compatibilitySummary.total === 0
        ? 100
        : this.clamp(
            (
              (compatibilitySummary.compatible * 100 +
                compatibilitySummary.conditional * 60) /
              compatibilitySummary.total
            )
          );

    const completeAssets = blueprint.assets.filter(
      (asset) =>
        asset.purpose.trim().length > 0 &&
        asset.version.trim().length > 0 &&
        Object.keys(asset.metadata).length > 0
    ).length;

    const metadataCompletenessScore =
      blueprint.assets.length === 0
        ? 100
        : this.clamp(
            (completeAssets / blueprint.assets.length) * 100
          );

    const score = this.clamp(
      driftScore * 0.25 +
        ruleComplianceScore * 0.2 +
        dependencyHealthScore * 0.25 +
        compatibilityScore * 0.15 +
        metadataCompletenessScore * 0.15
    );

    const reasons: string[] = [];

    if (driftScore < 80) {
      reasons.push(
        "Architecture drift is reducing foundation health."
      );
    }

    if (dependencyHealthScore < 80) {
      reasons.push(
        "Dependency health requires improvement."
      );
    }

    if (ruleComplianceScore < 80) {
      reasons.push(
        "Architecture rule compliance requires improvement."
      );
    }

    if (metadataCompletenessScore < 80) {
      reasons.push(
        "Architecture metadata completeness is insufficient."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Foundation architecture is healthy and aligned."
      );
    }

    const index: FoundationHealthIndex = {
      id: `foundation-health-index:${Date.now()}:${
        this.indexes.size + 1
      }`,
      blueprintId: blueprint.id,
      score,
      level: this.level(score),
      metrics: {
        driftScore,
        ruleComplianceScore,
        dependencyHealthScore,
        compatibilityScore,
        metadataCompletenessScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "foundation-health-index-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score < 60
          ? "warning"
          : "success",
      metadata: {
        blueprintId: blueprint.id,
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const indexes = this.list();

    return {
      total: indexes.length,
      latestScore:
        indexes.length === 0
          ? 0
          : indexes[indexes.length - 1]?.score ?? 0,
      healthy: indexes.filter(
        (item) =>
          item.level === "healthy" ||
          item.level === "excellent"
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(
      0,
      Math.min(100, Number(value.toFixed(2)))
    );
  }

  private level(
    score: number
  ): FoundationHealthIndex["level"] {
    if (score >= 90) {
      return "excellent";
    }

    if (score >= 75) {
      return "healthy";
    }

    if (score >= 60) {
      return "stable";
    }

    if (score >= 40) {
      return "degraded";
    }

    return "critical";
  }
}
