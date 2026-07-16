import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CAPABILITY_INTELLIGENCE_THRESHOLDS,
} from "./capability-intelligence.registry";
import {
  CapabilityDuplicateMatch,
  CapabilityIntelligenceScore,
  CapabilityRecommendation,
  CapabilityRiskSignal,
  CapabilityUsageProfile,
} from "./capability-intelligence.types";

@Injectable()
export class CapabilityRecommendationService {
  generate(input: {
    capabilityKey: string;
    score: CapabilityIntelligenceScore;
    usage: CapabilityUsageProfile;
    risks: CapabilityRiskSignal[];
    duplicates: CapabilityDuplicateMatch[];
  }): CapabilityRecommendation[] {
    const recommendations: CapabilityRecommendation[] = [];

    if (
      input.score.qualityIndex <
      CAPABILITY_INTELLIGENCE_THRESHOLDS.lowQuality
    ) {
      recommendations.push(
        this.make(
          input.capabilityKey,
          "OPTIMIZE",
          "HIGH",
          "Raise capability quality index",
          "The current quality index is below the platform target.",
          "Improves reliability, maintainability, and architectural fitness.",
          [
            "Address the lowest score breakdown dimensions.",
            "Add missing contracts, metrics, health, and documentation.",
            "Re-run capability intelligence evaluation.",
          ],
          0.9,
        ),
      );
    }

    if (
      input.score.trustScore <
      CAPABILITY_INTELLIGENCE_THRESHOLDS.lowTrust
    ) {
      recommendations.push(
        this.make(
          input.capabilityKey,
          "SECURE",
          "CRITICAL",
          "Increase capability trust",
          "Trust score is below the AVOS acceptable threshold.",
          "Reduces operational and governance risk.",
          [
            "Review authentication and authorization.",
            "Bind mandatory policies.",
            "Improve auditability and health visibility.",
          ],
          0.94,
        ),
      );
    }

    if (
      input.score.technicalDebtScore >
      CAPABILITY_INTELLIGENCE_THRESHOLDS.highTechnicalDebt
    ) {
      recommendations.push(
        this.make(
          input.capabilityKey,
          "OPTIMIZE",
          "HIGH",
          "Reduce technical debt",
          "Technical debt score is above the accepted threshold.",
          "Reduces future maintenance cost and failure probability.",
          [
            "Refactor dependency complexity.",
            "Complete missing documentation.",
            "Strengthen observability and governance.",
          ],
          0.88,
        ),
      );
    }

    const mergeCandidate = input.duplicates.find(
      (duplicate) => duplicate.recommendation === "MERGE",
    );
    if (mergeCandidate) {
      recommendations.push(
        this.make(
          input.capabilityKey,
          "MERGE",
          "HIGH",
          "Review capability consolidation",
          `High similarity detected with ${mergeCandidate.candidateCapabilityKey}.`,
          "Prevents duplicated capability investment and fragmentation.",
          [
            "Compare contracts and business purpose.",
            "Define a canonical surviving capability.",
            "Plan compatibility and migration.",
          ],
          mergeCandidate.similarity,
        ),
      );
    }

    if (
      input.usage.reuseScore <
      CAPABILITY_INTELLIGENCE_THRESHOLDS.strongReuse &&
      input.score.qualityIndex >= 70
    ) {
      recommendations.push(
        this.make(
          input.capabilityKey,
          "REUSE",
          "MEDIUM",
          "Increase capability reuse",
          "The capability is healthy but underused across the platform.",
          "Increases platform leverage and avoids future duplication.",
          [
            "Publish capability contracts to internal discovery.",
            "Add examples and integration documentation.",
            "Reference the capability from eligible orchestrations.",
          ],
          0.8,
        ),
      );
    }

    for (const risk of input.risks.slice(0, 3)) {
      recommendations.push(
        this.make(
          input.capabilityKey,
          risk.code.includes("DOCUMENTATION")
            ? "DOCUMENT"
            : risk.code.includes("METRICS") ||
                risk.code.includes("HEALTH")
              ? "OBSERVE"
              : "SECURE",
          risk.severity,
          `Resolve ${risk.code}`,
          risk.message,
          "Improves capability fitness and platform resilience.",
          ["Review evidence.", "Apply remediation.", "Re-evaluate scores."],
          0.85,
        ),
      );
    }

    if (
      input.score.maturityScore >= 80 &&
      input.score.riskScore < 25 &&
      input.usage.reuseScore >= 60
    ) {
      recommendations.push(
        this.make(
          input.capabilityKey,
          "EVOLVE",
          "LOW",
          "Consider lifecycle evolution",
          "The capability demonstrates strong maturity, low risk, and reuse.",
          "Enables broader platform adoption and strategic leverage.",
          [
            "Review lifecycle promotion criteria.",
            "Obtain architectural approval.",
            "Record the governed evolution decision.",
          ],
          0.78,
        ),
      );
    }

    return recommendations;
  }

  private make(
    capabilityKey: string,
    type: CapabilityRecommendation["type"],
    severity: CapabilityRecommendation["severity"],
    title: string,
    rationale: string,
    expectedValue: string,
    actions: string[],
    confidence: number,
  ): CapabilityRecommendation {
    return {
      id: randomUUID(),
      capabilityKey,
      type,
      severity,
      title,
      rationale,
      expectedValue,
      actions,
      confidence,
      generatedAt: new Date().toISOString(),
    };
  }
}