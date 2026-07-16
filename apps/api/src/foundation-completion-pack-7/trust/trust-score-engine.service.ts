import { Injectable } from "@nestjs/common";
import {
  TrustAssessment,
  TrustLevel
} from "../foundation-pack-7.types";
import { DecisionRegistryService } from "../decisions/decision-registry.service";
import { EvidenceRegistryService } from "../evidence/evidence-registry.service";
import { DataProvenanceGraphService } from "../provenance/data-provenance-graph.service";
import { TrustPolicyRegistryService } from "../policies/trust-policy-registry.service";
import { TrustAuditLedgerService } from "../audit/trust-audit-ledger.service";

@Injectable()
export class TrustScoreEngineService {
  private readonly assessments =
    new Map<string, TrustAssessment>();

  constructor(
    private readonly decisions: DecisionRegistryService,
    private readonly evidence: EvidenceRegistryService,
    private readonly provenance: DataProvenanceGraphService,
    private readonly policies: TrustPolicyRegistryService,
    private readonly audit: TrustAuditLedgerService
  ) {}

  list() {
    return Array.from(this.assessments.values());
  }

  get(id: string) {
    const assessment = this.assessments.get(id);

    if (!assessment) {
      throw new Error(`Trust assessment not found: ${id}`);
    }

    return assessment;
  }

  assessDecision(input: {
    decisionId: string;
    policyId: string;
    assessedByIdentityId: string;
  }) {
    const decision = this.decisions.get(input.decisionId);
    const policy = this.policies.get(input.policyId);
    const evidence = this.evidence.batch(decision.evidenceIds);
    const verifiedEvidence = evidence.filter(
      (record) => record.verified
    );

    const averageReliability =
      evidence.length === 0
        ? 0
        : evidence.reduce(
            (sum, record) => sum + record.reliabilityScore,
            0
          ) / evidence.length;

    const hasProvenance =
      decision.provenanceNodeIds.length > 0 &&
      decision.provenanceNodeIds.some(
        (nodeId) => this.provenance.hasLineage(nodeId)
      );

    const hasExplainability =
      decision.rationale.trim().length > 0 &&
      decision.explainabilityFactors.length > 0;

    const reasons: string[] = [];
    let score = 100;

    if (evidence.length < policy.minimumEvidenceCount) {
      score -= 20;
      reasons.push(
        `Evidence count ${evidence.length} is below required ${policy.minimumEvidenceCount}.`
      );
    }

    if (
      verifiedEvidence.length <
      policy.minimumVerifiedEvidenceCount
    ) {
      score -= 20;
      reasons.push(
        `Verified evidence count ${verifiedEvidence.length} is below required ${policy.minimumVerifiedEvidenceCount}.`
      );
    }

    if (
      averageReliability <
      policy.minimumAverageEvidenceReliability
    ) {
      score -= 20;
      reasons.push(
        `Average evidence reliability ${averageReliability.toFixed(
          2
        )} is below required ${policy.minimumAverageEvidenceReliability}.`
      );
    }

    if (decision.riskScore > policy.maximumRiskScore) {
      score -= 20;
      reasons.push(
        `Decision risk ${decision.riskScore} exceeds maximum ${policy.maximumRiskScore}.`
      );
    }

    if (policy.requireProvenance && !hasProvenance) {
      score -= 10;
      reasons.push("Required provenance lineage is missing.");
    }

    if (policy.requireExplainability && !hasExplainability) {
      score -= 10;
      reasons.push("Required explainability is missing.");
    }

    const requiresHumanApproval =
      decision.riskScore >= policy.requireHumanApprovalAboveRisk;

    if (
      requiresHumanApproval &&
      !decision.humanApprovalId
    ) {
      score -= 15;
      reasons.push(
        "Human approval evidence is required but not attached."
      );
    }

    score = this.clamp(score);

    if (reasons.length === 0) {
      reasons.push("All trust policy requirements passed.");
    }

    const passed =
      score >= 70 &&
      evidence.length >= policy.minimumEvidenceCount &&
      verifiedEvidence.length >=
        policy.minimumVerifiedEvidenceCount &&
      averageReliability >=
        policy.minimumAverageEvidenceReliability &&
      decision.riskScore <= policy.maximumRiskScore &&
      (!policy.requireProvenance || hasProvenance) &&
      (!policy.requireExplainability || hasExplainability) &&
      (!requiresHumanApproval || Boolean(decision.humanApprovalId));

    const assessment: TrustAssessment = {
      id: `trust-assessment:${Date.now()}:${
        this.assessments.size + 1
      }`,
      subjectType: "decision",
      subjectId: decision.id,
      policyId: policy.id,
      status: "completed",
      score,
      level: this.level(score),
      passed,
      reasons,
      metrics: {
        evidenceCount: evidence.length,
        verifiedEvidenceCount: verifiedEvidence.length,
        averageEvidenceReliability: Number(
          averageReliability.toFixed(2)
        ),
        riskScore: decision.riskScore,
        hasProvenance,
        hasExplainability,
        requiresHumanApproval,
        hasHumanApproval: Boolean(decision.humanApprovalId)
      },
      assessedByIdentityId: input.assessedByIdentityId,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(assessment.id, assessment);

    this.decisions.update(
      decision.id,
      {
        trustScore: assessment.score,
        requiresHumanApproval
      },
      {
        actorIdentityId: input.assessedByIdentityId,
        correlationId: decision.correlationId
      }
    );

    this.audit.record({
      correlationId: decision.correlationId,
      category: "trust",
      action: "decision-trust-assessed",
      subjectId: decision.id,
      actorIdentityId: input.assessedByIdentityId,
      outcome: passed ? "success" : "blocked",
      after: {
        trustScore: assessment.score,
        trustLevel: assessment.level,
        passed: assessment.passed
      },
      metadata: {
        assessmentId: assessment.id,
        policyId: policy.id,
        reasons: assessment.reasons
      }
    });

    return assessment;
  }

  bySubject(subjectId: string) {
    return this.list().filter(
      (assessment) => assessment.subjectId === subjectId
    );
  }

  summary() {
    const assessments = this.list();

    return {
      total: assessments.length,
      passed: assessments.filter(
        (assessment) => assessment.passed
      ).length,
      failed: assessments.filter(
        (assessment) => !assessment.passed
      ).length,
      averageScore:
        assessments.length === 0
          ? 0
          : Number(
              (
                assessments.reduce(
                  (sum, assessment) =>
                    sum + assessment.score,
                  0
                ) / assessments.length
              ).toFixed(2)
            )
    };
  }

  private level(score: number): TrustLevel {
    if (score >= 90) {
      return "verified";
    }

    if (score >= 75) {
      return "high";
    }

    if (score >= 50) {
      return "moderate";
    }

    if (score >= 25) {
      return "low";
    }

    return "untrusted";
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }
}
