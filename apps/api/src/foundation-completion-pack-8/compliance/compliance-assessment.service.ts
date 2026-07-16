import { Injectable } from "@nestjs/common";
import {
  ComplianceAssessment,
  ComplianceStatus,
  GovernanceScope
} from "../foundation-pack-8.types";
import { ComplianceControlRegistryService } from "./compliance-control-registry.service";
import { GovernanceEvidenceService } from "../evidence/governance-evidence.service";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class ComplianceAssessmentService {
  private readonly assessments =
    new Map<string, ComplianceAssessment>();

  constructor(
    private readonly controls: ComplianceControlRegistryService,
    private readonly evidence: GovernanceEvidenceService,
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return Array.from(this.assessments.values());
  }

  assess(input: {
    subjectId: string;
    subjectType: GovernanceScope;
    controlId: string;
    assessedByIdentityId: string;
    correlationId: string;
  }) {
    const control = this.controls.get(input.controlId);

    const evidence = this.evidence
      .bySubject(input.subjectId)
      .filter(
        (record) =>
          record.controlId === control.id ||
          !record.controlId
      );

    const verifiedEvidence = evidence.filter(
      (record) => record.verified
    );

    const findings: string[] = [];

    const evidenceRequirementCount =
      control.evidenceRequirements.length;

    const requirementScore =
      evidenceRequirementCount === 0
        ? 100
        : Math.min(
            100,
            (verifiedEvidence.length /
              evidenceRequirementCount) *
              100
          );

    if (
      verifiedEvidence.length <
      evidenceRequirementCount
    ) {
      findings.push(
        `Verified evidence ${verifiedEvidence.length} is below required ${evidenceRequirementCount}.`
      );
    }

    let status: ComplianceStatus;

    if (requirementScore >= 100) {
      status = "compliant";
    }
    else if (requirementScore > 0) {
      status = "partially-compliant";
    }
    else {
      status = "non-compliant";
    }

    const assessment: ComplianceAssessment = {
      id: `compliance-assessment:${Date.now()}:${
        this.assessments.size + 1
      }`,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      controlId: control.id,
      status,
      score: Number(requirementScore.toFixed(2)),
      findings,
      evidenceIds: evidence.map((record) => record.id),
      assessedByIdentityId: input.assessedByIdentityId,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(assessment.id, assessment);

    this.audit.record({
      correlationId: input.correlationId,
      category: "compliance",
      action: "control-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.assessedByIdentityId,
      outcome:
        status === "compliant"
          ? "success"
          : status === "partially-compliant"
            ? "warning"
            : "blocked",
      metadata: {
        controlId: control.id,
        score: assessment.score,
        status
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
      compliant: assessments.filter(
        (item) => item.status === "compliant"
      ).length,
      partiallyCompliant: assessments.filter(
        (item) => item.status === "partially-compliant"
      ).length,
      nonCompliant: assessments.filter(
        (item) => item.status === "non-compliant"
      ).length,
      averageScore:
        assessments.length === 0
          ? 0
          : Number(
              (
                assessments.reduce(
                  (sum, item) => sum + item.score,
                  0
                ) / assessments.length
              ).toFixed(2)
            )
    };
  }
}
