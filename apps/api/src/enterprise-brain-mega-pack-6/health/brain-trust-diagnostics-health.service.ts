import { Injectable } from "@nestjs/common";
import { BrainTrustDiagnosticsHealthIndex } from "../enterprise-brain-mega-pack-6.types";
import { BrainExplainabilityService } from "../explainability/brain-explainability.service";
import { BrainDecisionTraceabilityService } from "../traceability/brain-decision-traceability.service";
import { BrainTrustScoreService } from "../trust/brain-trust-score.service";
import { BrainEvidenceVaultService } from "../evidence/brain-evidence-vault.service";
import { BrainHumanApprovalService } from "../approval/brain-human-approval.service";
import { BrainDiagnosticsService } from "../diagnostics/brain-diagnostics.service";
import { BrainTrustGovernanceService } from "../governance/brain-trust-governance.service";
import { BrainTrustAuditService } from "../observability/brain-trust-audit.service";

@Injectable()
export class BrainTrustDiagnosticsHealthService {
  private readonly indexes =
    new Map<string, BrainTrustDiagnosticsHealthIndex>();

  constructor(
    private readonly explainability: BrainExplainabilityService,
    private readonly traceability: BrainDecisionTraceabilityService,
    private readonly trust: BrainTrustScoreService,
    private readonly evidence: BrainEvidenceVaultService,
    private readonly approvals: BrainHumanApprovalService,
    private readonly diagnostics: BrainDiagnosticsService,
    private readonly governance: BrainTrustGovernanceService,
    private readonly audit: BrainTrustAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const explainability = this.explainability.summary();
    const traceability = this.traceability.summary();
    const trust = this.trust.summary();
    const evidence = this.evidence.summary();
    const approvals = this.approvals.summary();
    const diagnostics = this.diagnostics.summary();
    const governance = this.governance.summary();

    const explainabilityScore =
      explainability.total === 0
        ? 100
        : explainability.averageConfidence;

    const traceabilityScore =
      traceability.total === 0
        ? 100
        : Number(
            (
              traceability.completed /
              traceability.total *
              100
            ).toFixed(2)
          );

    const trustScore =
      trust.total === 0
        ? 100
        : trust.averageScore;

    const evidenceScore =
      evidence.total === 0
        ? 100
        : Number(
            (
              evidence.verified /
              evidence.total *
              100
            ).toFixed(2)
          );

    const approvalScore =
      approvals.total === 0
        ? 100
        : Number(
            (
              approvals.approved /
              approvals.total *
              100
            ).toFixed(2)
          );

    const diagnosticsScore =
      diagnostics.total === 0
        ? 100
        : Math.max(
            0,
            100 -
            diagnostics.critical * 30 -
            diagnostics.errors * 20 -
            diagnostics.warnings * 5
          );

    const governanceScore =
      governance.total === 0
        ? 100
        : governance.averageScore;

    const score = Number(
      (
        explainabilityScore * 0.15 +
        traceabilityScore * 0.15 +
        trustScore * 0.2 +
        evidenceScore * 0.15 +
        approvalScore * 0.1 +
        diagnosticsScore * 0.1 +
        governanceScore * 0.15
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (explainabilityScore < 90) {
      reasons.push("Brain explainability quality is below target.");
    }

    if (traceabilityScore < 90) {
      reasons.push("Brain decision traces are incomplete.");
    }

    if (trustScore < 75) {
      reasons.push("Brain trust score is below target.");
    }

    if (evidenceScore < 90) {
      reasons.push("Brain evidence verification is incomplete.");
    }

    if (approvalScore < 90) {
      reasons.push("Brain approvals remain unresolved.");
    }

    if (diagnosticsScore < 90) {
      reasons.push("Brain diagnostics contain unresolved findings.");
    }

    if (governanceScore < 90) {
      reasons.push("Brain trust governance is below target.");
    }

    if (reasons.length === 0) {
      reasons.push("Enterprise Brain trust and diagnostics are healthy.");
    }

    const index: BrainTrustDiagnosticsHealthIndex = {
      id: `brain-trust-diagnostics-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        explainabilityScore,
        traceabilityScore,
        trustScore,
        evidenceScore,
        approvalScore,
        diagnosticsScore,
        governanceScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "brain-trust-diagnostics-health-calculated",
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
  ): BrainTrustDiagnosticsHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
