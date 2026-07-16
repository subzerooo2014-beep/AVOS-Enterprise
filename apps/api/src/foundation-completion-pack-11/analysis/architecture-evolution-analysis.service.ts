import { Injectable } from "@nestjs/common";
import {
  EvolutionAnalysisResult,
  EvolutionRiskLevel
} from "../foundation-pack-11.types";
import { ArchitectureEvolutionRequestService } from "../requests/architecture-evolution-request.service";
import { EvolutionAuditService } from "../observability/evolution-audit.service";
import { EvolutionHistoryService } from "../history/evolution-history.service";

@Injectable()
export class ArchitectureEvolutionAnalysisService {
  private readonly analyses =
    new Map<string, EvolutionAnalysisResult>();

  constructor(
    private readonly requests: ArchitectureEvolutionRequestService,
    private readonly audit: EvolutionAuditService,
    private readonly history: EvolutionHistoryService
  ) {}

  list() {
    return Array.from(this.analyses.values());
  }

  get(id: string) {
    const analysis = this.analyses.get(id);

    if (!analysis) {
      throw new Error(
        `Evolution analysis not found: ${id}`
      );
    }

    return analysis;
  }

  byRequest(requestId: string) {
    return this.list().filter(
      (analysis) => analysis.requestId === requestId
    );
  }

  analyze(input: {
    requestId: string;
    analyzedByIdentityId: string;
  }) {
    const request = this.requests.get(input.requestId);

    this.requests.updateStatus(
      request.id,
      "under-analysis",
      input.analyzedByIdentityId
    );

    const impactedAssetIds = Array.from(
      new Set(
        request.changes.flatMap((change) => [
          change.assetId,
          ...change.dependenciesAffected
        ])
      )
    );

    const criticalAssetIds = request.changes
      .filter(
        (change) =>
          change.metadata["critical"] === true ||
          change.metadata["tier"] === 0
      )
      .map((change) => change.assetId);

    const breakingChanges: string[] = [];
    const compatibilityRisks: string[] = [];
    const dependencyRisks: string[] = [];
    const governanceRisks: string[] = [];
    const recommendations: string[] = [];

    for (const change of request.changes) {
      if (
        change.changeType === "remove" ||
        change.changeType === "replace"
      ) {
        breakingChanges.push(
          `Potentially breaking change on asset ${change.assetId}.`
        );
      }

      if (
        change.currentVersion &&
        change.targetVersion &&
        change.currentVersion !== change.targetVersion
      ) {
        compatibilityRisks.push(
          `Version transition ${change.currentVersion} -> ${change.targetVersion} requires compatibility validation for ${change.assetId}.`
        );
      }

      if (change.dependenciesAffected.length > 5) {
        dependencyRisks.push(
          `High dependency impact for ${change.assetId}.`
        );
      }

      if (change.contractsAffected.length > 0) {
        governanceRisks.push(
          `Contract changes require explicit approval for ${change.assetId}.`
        );
      }
    }

    let riskScore = 10;
    riskScore += breakingChanges.length * 20;
    riskScore += compatibilityRisks.length * 10;
    riskScore += dependencyRisks.length * 10;
    riskScore += governanceRisks.length * 10;
    riskScore += criticalAssetIds.length * 20;
    riskScore = Math.max(0, Math.min(100, riskScore));

    if (breakingChanges.length > 0) {
      recommendations.push(
        "Create a rollback checkpoint before execution."
      );
    }

    if (compatibilityRisks.length > 0) {
      recommendations.push(
        "Run compatibility assessment before approval."
      );
    }

    if (criticalAssetIds.length > 0) {
      recommendations.push(
        "Require explicit human approval for critical assets."
      );
    }

    if (dependencyRisks.length > 0) {
      recommendations.push(
        "Execute changes in dependency-safe order."
      );
    }

    const result: EvolutionAnalysisResult = {
      id: `evolution-analysis:${Date.now()}:${
        this.analyses.size + 1
      }`,
      requestId: request.id,
      blueprintId: request.blueprintId,
      riskScore,
      riskLevel: this.level(riskScore),
      impactedAssetIds,
      criticalAssetIds,
      breakingChanges,
      compatibilityRisks,
      dependencyRisks,
      governanceRisks,
      recommendations,
      safeToProceed:
        riskScore < 75 &&
        criticalAssetIds.length === 0,
      analyzedByIdentityId: input.analyzedByIdentityId,
      analyzedAt: new Date().toISOString()
    };

    this.analyses.set(result.id, result);

    this.audit.record({
      correlationId: request.correlationId,
      category: "analysis",
      action: "evolution-analysis-completed",
      subjectId: result.id,
      actorIdentityId: input.analyzedByIdentityId,
      outcome:
        result.safeToProceed
          ? "success"
          : "warning",
      metadata: {
        requestId: request.id,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        safeToProceed: result.safeToProceed
      }
    });

    this.history.record({
      requestId: request.id,
      blueprintId: request.blueprintId,
      action: "analysis-completed",
      actorIdentityId: input.analyzedByIdentityId,
      metadata: {
        analysisId: result.id,
        riskScore: result.riskScore
      }
    });

    return result;
  }

  summary() {
    const analyses = this.list();

    return {
      total: analyses.length,
      critical: analyses.filter(
        (analysis) => analysis.riskLevel === "critical"
      ).length,
      high: analyses.filter(
        (analysis) => analysis.riskLevel === "high"
      ).length,
      safeToProceed: analyses.filter(
        (analysis) => analysis.safeToProceed
      ).length
    };
  }

  private level(score: number): EvolutionRiskLevel {
    if (score >= 75) return "critical";
    if (score >= 50) return "high";
    if (score >= 25) return "moderate";
    return "low";
  }
}
