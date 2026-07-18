import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryRecommendation,
  AvosFactoryRecommendationStatus
} from "./avos-factory-intelligence.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryRecommendationEngineService {
  private readonly recommendations: AvosFactoryRecommendation[] = [];

  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  generate(subjectId: string): AvosFactoryRecommendation[] {
    const analyses = this.analyzer.findBySubject(subjectId);

    if (analyses.length === 0) {
      return [];
    }

    const latest = analyses[0];
    const generated: AvosFactoryRecommendation[] = [];

    if (latest.quality.overall < 80) {
      generated.push(
        this.create({
          subjectId,
          category: "quality",
          title: "Raise project quality baseline",
          description:
            "Improve architecture, maintainability, security, and documentation before promotion.",
          rationale: [
            `Current overall quality is ${latest.quality.overall}.`,
            "Factory quality target is 80 or higher."
          ],
          expectedImpact: 88,
          confidence: 92,
          severity: latest.quality.overall < 60 ? "critical" : "warning"
        })
      );
    }

    if (latest.durationMs > 30000) {
      generated.push(
        this.create({
          subjectId,
          category: "performance",
          title: "Optimize generation duration",
          description:
            "Reduce expensive generation stages and increase reusable capability resolution.",
          rationale: [
            `Generation duration was ${latest.durationMs} ms.`,
            "Slow generation pattern was detected."
          ],
          expectedImpact: 72,
          confidence: 85,
          severity: "warning"
        })
      );
    }

    if (latest.reusedCapabilities.length === 0) {
      generated.push(
        this.create({
          subjectId,
          category: "capability",
          title: "Increase capability reuse",
          description:
            "Resolve existing Capability Fabric assets before generating new implementation.",
          rationale: [
            "No reused capabilities were recorded.",
            "Capability First requires reuse analysis before creation."
          ],
          expectedImpact: 90,
          confidence: 94,
          severity: "warning"
        })
      );
    }

    if (!latest.success) {
      generated.push(
        this.create({
          subjectId,
          category: "governance",
          title: "Require failure review",
          description:
            "Create a governed review before retrying or promoting the generated project.",
          rationale: [
            "The most recent generation failed.",
            ...latest.failures.slice(0, 3)
          ],
          expectedImpact: 95,
          confidence: 98,
          severity: "critical"
        })
      );
    }

    this.recommendations.unshift(...generated);
    return generated.map((recommendation) => structuredClone(recommendation));
  }

  decide(input: {
    recommendationId: string;
    status: Exclude<AvosFactoryRecommendationStatus, "proposed">;
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
  }): AvosFactoryRecommendation {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Recommendation decision requires Human Final Authority approval."
      );
    }

    const recommendation = this.recommendations.find(
      (candidate) => candidate.id === input.recommendationId
    );

    if (!recommendation) {
      throw new BadRequestException(
        `Recommendation not found: ${input.recommendationId}`
      );
    }

    recommendation.status = input.status;
    recommendation.approvedBy = input.approvedBy;
    recommendation.humanApproved = true;
    recommendation.decidedAt = new Date().toISOString();

    this.audit.append({
      category: "governance",
      action: "factory-recommendation-decided",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: true,
      resourceId: recommendation.id,
      details: {
        status: input.status,
        subjectId: recommendation.subjectId
      }
    });

    return structuredClone(recommendation);
  }

  list(limit = 100): AvosFactoryRecommendation[] {
    return this.recommendations
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((recommendation) => structuredClone(recommendation));
  }

  countActive(): number {
    return this.recommendations.filter(
      (recommendation) => recommendation.status === "proposed"
    ).length;
  }

  countCritical(): number {
    return this.recommendations.filter(
      (recommendation) =>
        recommendation.status === "proposed" &&
        recommendation.severity === "critical"
    ).length;
  }

  private create(
    input: Omit<
      AvosFactoryRecommendation,
      | "id"
      | "status"
      | "proposedBy"
      | "humanApproved"
      | "createdAt"
    >
  ): AvosFactoryRecommendation {
    return {
      id: randomUUID(),
      ...input,
      status: "proposed",
      proposedBy: "system:factory-intelligence",
      humanApproved: false,
      createdAt: new Date().toISOString()
    };
  }
}
