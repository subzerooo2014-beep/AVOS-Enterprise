import { Injectable } from "@nestjs/common";
import { BrainRiskAssessment } from "../enterprise-brain-mega-pack-4.types";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainRiskAssessmentService {
  private readonly records = new Map<string, BrainRiskAssessment>();

  constructor(
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  assess(input: {
    subjectId: string;
    factors: BrainRiskAssessment["factors"];
    mitigations?: string[];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const totalWeight =
      input.factors.reduce((sum, x) => sum + x.weight, 0) || 1;

    const score = Number(
      (
        input.factors.reduce(
          (sum, x) =>
            sum + x.score * x.weight,
          0
        ) / totalWeight
      ).toFixed(2)
    );

    const level: BrainRiskAssessment["level"] =
      score >= 80
        ? "critical"
        : score >= 60
          ? "high"
          : score >= 35
            ? "moderate"
            : "low";

    const record: BrainRiskAssessment = {
      id: `brain-risk:${Date.now()}:${this.records.size + 1}`,
      subjectId: input.subjectId,
      score,
      level,
      factors: input.factors.map((x) => ({ ...x })),
      mitigations: Array.from(new Set(input.mitigations ?? [])),
      requiresHumanApproval: score >= 60,
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "risk",
      action: "brain-risk-assessed",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        level === "critical"
          ? "blocked"
          : level === "high"
            ? "warning"
            : "success",
      metadata: {
        score,
        level
      }
    });

    return record;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      high:
        items.filter(
          (x) => x.level === "high" || x.level === "critical"
        ).length,
      averageScore:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce((sum, x) => sum + x.score, 0) /
                items.length
              ).toFixed(2)
            )
    };
  }
}
