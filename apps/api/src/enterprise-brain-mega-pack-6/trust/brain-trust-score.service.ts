import { Injectable } from "@nestjs/common";
import { BrainTrustScore } from "../enterprise-brain-mega-pack-6.types";
import { BrainEvidenceVaultService } from "../evidence/brain-evidence-vault.service";
import { BrainDecisionTraceabilityService } from "../traceability/brain-decision-traceability.service";
import { BrainExplainabilityService } from "../explainability/brain-explainability.service";
import { BrainHumanApprovalService } from "../approval/brain-human-approval.service";
import { BrainTrustAuditService } from "../observability/brain-trust-audit.service";

@Injectable()
export class BrainTrustScoreService {
  private readonly scores = new Map<string, BrainTrustScore>();

  constructor(
    private readonly evidence: BrainEvidenceVaultService,
    private readonly traces: BrainDecisionTraceabilityService,
    private readonly explanations: BrainExplainabilityService,
    private readonly approvals: BrainHumanApprovalService,
    private readonly audit: BrainTrustAuditService
  ) {}

  list() {
    return Array.from(this.scores.values());
  }

  calculate(input: {
    subjectId: string;
    confidence: number;
    riskScore: number;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const subjectEvidence = this.evidence.list().filter(
      (item) => item.subjectId === input.subjectId
    );

    const subjectTraces = this.traces.list().filter(
      (item) => item.subjectId === input.subjectId
    );

    const subjectExplanations = this.explanations.list().filter(
      (item) => item.subjectId === input.subjectId
    );

    const subjectApprovals = this.approvals.list().filter(
      (item) => item.subjectId === input.subjectId
    );

    const evidenceQuality =
      subjectEvidence.length === 0
        ? 50
        : Number(
            (
              subjectEvidence.reduce(
                (sum, item) =>
                  sum +
                  (
                    item.confidence * 0.7 +
                    (item.verified ? 30 : 0)
                  ),
                0
              ) /
              subjectEvidence.length
            ).toFixed(2)
          );

    const traceCompleteness =
      subjectTraces.length === 0
        ? 50
        : subjectTraces.every(
            (trace) => trace.status === "completed"
          )
          ? 100
          : 70;

    const confidenceQuality =
      Math.max(0, Math.min(100, input.confidence));

    const riskControl =
      Math.max(0, 100 - Math.max(0, Math.min(100, input.riskScore)));

    const approvalIntegrity =
      subjectApprovals.length === 0
        ? input.riskScore >= 70
          ? 40
          : 100
        : subjectApprovals.some(
            (approval) => approval.status === "approved"
          )
          ? 100
          : 50;

    const provenanceQuality =
      subjectEvidence.length === 0
        ? 50
        : subjectEvidence.every(
            (item) =>
              item.provenance.origin.length > 0 &&
              item.provenance.capturedByIdentityId.length > 0
          )
          ? 100
          : 70;

    const score = Number(
      (
        evidenceQuality * 0.2 +
        traceCompleteness * 0.2 +
        confidenceQuality * 0.15 +
        riskControl * 0.15 +
        approvalIntegrity * 0.15 +
        provenanceQuality * 0.15
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (evidenceQuality < 80) {
      reasons.push("Evidence quality or verification is incomplete.");
    }

    if (traceCompleteness < 80) {
      reasons.push("Decision trace is incomplete.");
    }

    if (confidenceQuality < 70) {
      reasons.push("Decision confidence is below target.");
    }

    if (riskControl < 60) {
      reasons.push("Decision risk is elevated.");
    }

    if (approvalIntegrity < 80) {
      reasons.push("Required human approval is incomplete.");
    }

    if (provenanceQuality < 80) {
      reasons.push("Evidence provenance is incomplete.");
    }

    if (subjectExplanations.length === 0) {
      reasons.push("No explanation exists for this subject.");
    }

    if (reasons.length === 0) {
      reasons.push("Brain subject has verified trust controls.");
    }

    const trust: BrainTrustScore = {
      id: `brain-trust-score:${Date.now()}:${this.scores.size + 1}`,
      subjectId: input.subjectId,
      score,
      level: this.level(score),
      dimensions: {
        evidenceQuality,
        traceCompleteness,
        confidenceQuality,
        riskControl,
        approvalIntegrity,
        provenanceQuality
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.scores.set(trust.id, trust);

    this.audit.record({
      correlationId: input.correlationId,
      category: "trust",
      action: "brain-trust-score-calculated",
      subjectId: trust.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: trust.level
      }
    });

    return trust;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      verified: items.filter((x) => x.level === "verified").length,
      high: items.filter((x) => x.level === "high").length,
      low:
        items.filter(
          (x) =>
            x.level === "low" ||
            x.level === "untrusted"
        ).length,
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

  private level(score: number): BrainTrustScore["level"] {
    if (score >= 90) return "verified";
    if (score >= 75) return "high";
    if (score >= 55) return "moderate";
    if (score >= 35) return "low";
    return "untrusted";
  }
}
