import { Injectable } from "@nestjs/common";
import { BrainGovernanceAssessment } from "../enterprise-brain-mega-pack-6.types";
import { BrainTrustAuditService } from "../observability/brain-trust-audit.service";

@Injectable()
export class BrainTrustGovernanceService {
  private readonly assessments =
    new Map<string, BrainGovernanceAssessment>();

  constructor(
    private readonly audit: BrainTrustAuditService
  ) {}

  list() {
    return Array.from(this.assessments.values());
  }

  assess(input: {
    subjectId: string;
    checks: Record<string, boolean>;
    assessedByIdentityId: string;
    correlationId: string;
  }) {
    const requiredChecks = [
      "explainabilityAvailable",
      "traceabilityComplete",
      "evidenceAvailable",
      "provenanceAvailable",
      "riskAssessed",
      "humanFinalAuthorityPreserved"
    ];

    const mergedChecks: Record<string, boolean> = {};

    for (const check of requiredChecks) {
      mergedChecks[check] = input.checks[check] === true;
    }

    const failedChecks = Object.entries(mergedChecks)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    const score = Number(
      (
        Object.values(mergedChecks).filter(Boolean).length /
        Object.values(mergedChecks).length *
        100
      ).toFixed(2)
    );

    const conditions = failedChecks.map(
      (check) => `Resolve governance check: ${check}.`
    );

    const assessment: BrainGovernanceAssessment = {
      id: `brain-governance-assessment:${Date.now()}:${
        this.assessments.size + 1
      }`,
      subjectId: input.subjectId,
      score,
      allowed: failedChecks.length === 0,
      checks: mergedChecks,
      failedChecks,
      conditions,
      assessedByIdentityId: input.assessedByIdentityId,
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.assessments.set(assessment.id, assessment);

    this.audit.record({
      correlationId: input.correlationId,
      category: "governance",
      action: "brain-trust-governance-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.assessedByIdentityId,
      outcome:
        assessment.allowed
          ? "success"
          : "blocked",
      metadata: {
        score,
        failedChecks
      }
    });

    return assessment;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      allowed: items.filter((x) => x.allowed).length,
      blocked: items.filter((x) => !x.allowed).length,
      averageScore:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce((sum, item) => sum + item.score, 0) /
                items.length
              ).toFixed(2)
            )
    };
  }
}
