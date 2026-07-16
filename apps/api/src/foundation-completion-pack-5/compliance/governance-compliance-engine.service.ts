import { Injectable } from "@nestjs/common";
import { ComplianceAssessment } from "../foundation-pack-5.types";
import { GovernancePolicyService } from "../policy/governance-policy.service";
import { GovernanceStandardsRegistryService } from "../standards/governance-standards-registry.service";

@Injectable()
export class GovernanceComplianceEngineService {
  private readonly assessments: ComplianceAssessment[] = [];

  constructor(
    private readonly policies: GovernancePolicyService,
    private readonly standards: GovernanceStandardsRegistryService
  ) {}

  list() {
    return [...this.assessments];
  }

  assess(input: {
    subjectId: string;
    subjectType: string;
    policyIds: string[];
    standardIds: string[];
    evidence: Record<string, boolean>;
    assessedByIdentityId: string;
  }) {
    const findings: string[] = [];

    for (const policyId of input.policyIds) {
      this.policies.get(policyId);
    }

    for (const standardId of input.standardIds) {
      const standard = this.standards.get(standardId);

      for (const requirement of standard.requirements) {
        if (input.evidence[requirement] !== true) {
          findings.push(`Missing evidence: ${requirement}`);
        }
      }
    }

    const totalRequirements = input.standardIds.reduce(
      (sum, standardId) =>
        sum + this.standards.get(standardId).requirements.length,
      0
    );

    const passedRequirements = Math.max(
      0,
      totalRequirements - findings.length
    );

    const score =
      totalRequirements === 0
        ? 100
        : Number(
            ((passedRequirements / totalRequirements) * 100).toFixed(2)
          );

    const assessment: ComplianceAssessment = {
      id: `compliance:${Date.now()}:${this.assessments.length + 1}`,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      policyIds: Array.from(new Set(input.policyIds)),
      standardIds: Array.from(new Set(input.standardIds)),
      passed: findings.length === 0,
      score,
      findings,
      assessedByIdentityId: input.assessedByIdentityId,
      assessedAt: new Date().toISOString()
    };

    this.assessments.push(assessment);
    return assessment;
  }

  summary() {
    return {
      total: this.assessments.length,
      passed: this.assessments.filter((assessment) => assessment.passed)
        .length,
      failed: this.assessments.filter((assessment) => !assessment.passed)
        .length
    };
  }
}
