import { Injectable } from "@nestjs/common";
import {
  ArchitectureRecommendation
} from "../foundation-pack-10.types";
import { ArchitectureDriftDetectorService } from "../drift/architecture-drift-detector.service";
import { ArchitectureRuleEngineService } from "../rules/architecture-rule-engine.service";
import { DependencyHealthAnalyzerService } from "../health/dependency-health-analyzer.service";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class ArchitectureRecommendationEngineService {
  private readonly recommendations =
    new Map<string, ArchitectureRecommendation>();

  constructor(
    private readonly drift: ArchitectureDriftDetectorService,
    private readonly rules: ArchitectureRuleEngineService,
    private readonly dependencyHealth: DependencyHealthAnalyzerService,
    private readonly audit: ArchitectureAuditService
  ) {}

  list() {
    return Array.from(this.recommendations.values());
  }

  generate(input: {
    blueprintId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const generated: ArchitectureRecommendation[] = [];

    for (const finding of this.drift.list()) {
      if (finding.blueprintId !== input.blueprintId) {
        continue;
      }

      generated.push(
        this.create(
          input.blueprintId,
          "drift",
          finding.severity === "critical"
            ? "critical"
            : finding.severity === "high"
              ? "high"
              : "medium",
          `Resolve ${finding.driftType}`,
          finding.message,
          [finding.assetId],
          [
            "Runtime and blueprint must remain synchronized.",
            "Living Blueprint is the architecture source of truth."
          ]
        )
      );
    }

    for (const finding of this.rules.listFindings()) {
      if (finding.blueprintId !== input.blueprintId) {
        continue;
      }

      generated.push(
        this.create(
          input.blueprintId,
          "quality",
          finding.severity === "critical"
            ? "critical"
            : finding.severity === "error"
              ? "high"
              : "medium",
          "Resolve architecture rule violation",
          finding.message,
          [finding.assetId],
          [
            `Rule ${finding.ruleId} is not satisfied.`
          ]
        )
      );
    }

    for (const finding of this.dependencyHealth.list()) {
      if (finding.blueprintId !== input.blueprintId) {
        continue;
      }

      generated.push(
        this.create(
          input.blueprintId,
          "dependency",
          finding.severity === "critical"
            ? "critical"
            : finding.severity === "error"
              ? "high"
              : "medium",
          `Improve dependency health: ${finding.code}`,
          finding.message,
          [finding.assetId, ...finding.relatedAssetIds],
          [
            "Dependency health protects platform resilience.",
            "Critical dependencies must be explicit and controlled."
          ]
        )
      );
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "recommendation",
      action: "architecture-recommendations-generated",
      subjectId: input.blueprintId,
      actorIdentityId: input.actorIdentityId,
      outcome:
        generated.some(
          (item) =>
            item.priority === "critical" ||
            item.priority === "high"
        )
          ? "warning"
          : "success",
      metadata: {
        generated: generated.length
      }
    });

    return {
      blueprintId: input.blueprintId,
      generated,
      createdAt: new Date().toISOString()
    };
  }

  updateStatus(
    id: string,
    status: ArchitectureRecommendation["status"]
  ) {
    const current = this.recommendations.get(id);

    if (!current) {
      throw new Error(
        `Architecture recommendation not found: ${id}`
      );
    }

    const updated: ArchitectureRecommendation = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.recommendations.set(id, updated);
    return updated;
  }

  summary() {
    const recommendations = this.list();

    return {
      total: recommendations.length,
      open: recommendations.filter(
        (item) => item.status === "open"
      ).length,
      critical: recommendations.filter(
        (item) => item.priority === "critical"
      ).length,
      high: recommendations.filter(
        (item) => item.priority === "high"
      ).length,
      implemented: recommendations.filter(
        (item) => item.status === "implemented"
      ).length
    };
  }

  private create(
    blueprintId: string,
    category: ArchitectureRecommendation["category"],
    priority: ArchitectureRecommendation["priority"],
    title: string,
    description: string,
    relatedAssetIds: string[],
    rationale: string[]
  ) {
    const recommendation: ArchitectureRecommendation = {
      id: `architecture-recommendation:${Date.now()}:${
        this.recommendations.size + 1
      }`,
      blueprintId,
      category,
      priority,
      title,
      description,
      relatedAssetIds: Array.from(
        new Set(relatedAssetIds)
      ),
      rationale,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.recommendations.set(
      recommendation.id,
      recommendation
    );

    return recommendation;
  }
}
