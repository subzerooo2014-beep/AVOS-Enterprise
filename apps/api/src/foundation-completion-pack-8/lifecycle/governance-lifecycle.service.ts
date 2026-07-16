import { BadRequestException, Injectable } from "@nestjs/common";
import {
  GovernanceLifecycleRecord,
  GovernanceScope,
  LifecycleStage
} from "../foundation-pack-8.types";
import { ComplianceAssessmentService } from "../compliance/compliance-assessment.service";
import { EnterpriseRiskRegistryService } from "../risk/enterprise-risk-registry.service";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class GovernanceLifecycleService {
  private readonly records: GovernanceLifecycleRecord[] = [];

  private readonly allowedTransitions: Record<
    LifecycleStage,
    LifecycleStage[]
  > = {
    concept: ["prototype"],
    prototype: ["shared-capability", "legacy-asset"],
    "shared-capability": ["core-engine", "legacy-asset"],
    "core-engine": ["platform-service", "legacy-asset"],
    "platform-service": ["standalone-product", "legacy-asset"],
    "standalone-product": ["legacy-asset"],
    "legacy-asset": []
  };

  constructor(
    private readonly compliance: ComplianceAssessmentService,
    private readonly risks: EnterpriseRiskRegistryService,
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return [...this.records];
  }

  current(subjectId: string) {
    return this.records
      .filter((record) => record.subjectId === subjectId)
      .sort((left, right) =>
        right.transitionedAt.localeCompare(left.transitionedAt)
      )[0];
  }

  transition(input: {
    subjectId: string;
    subjectType: GovernanceScope;
    toStage: LifecycleStage;
    transitionReason: string;
    transitionedByIdentityId: string;
    approvedByIdentityId?: string;
    governanceChecks?: string[];
    correlationId: string;
  }) {
    const current = this.current(input.subjectId);
    const fromStage = current?.currentStage;

    if (
      fromStage &&
      !this.allowedTransitions[fromStage].includes(input.toStage)
    ) {
      throw new BadRequestException(
        `Invalid lifecycle transition from ${fromStage} to ${input.toStage}.`
      );
    }

    if (!fromStage && input.toStage !== "concept") {
      throw new BadRequestException(
        "A new governed asset must begin at concept stage."
      );
    }

    const assessments = this.compliance.bySubject(input.subjectId);
    const risks = this.risks.bySubject(input.subjectId);

    const blockingAssessment = assessments.some(
      (assessment) => assessment.status === "non-compliant"
    );

    const criticalRisk = risks.some(
      (risk) => risk.active && risk.level === "critical"
    );

    if (
      input.toStage !== "concept" &&
      (blockingAssessment || criticalRisk)
    ) {
      throw new BadRequestException(
        "Lifecycle transition blocked by compliance or critical risk."
      );
    }

    const record: GovernanceLifecycleRecord = {
      id: `governance-lifecycle:${Date.now()}:${
        this.records.length + 1
      }`,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      currentStage: input.toStage,
      previousStage: fromStage,
      transitionReason: input.transitionReason,
      transitionedByIdentityId:
        input.transitionedByIdentityId,
      approvedByIdentityId: input.approvedByIdentityId,
      governanceChecks: input.governanceChecks ?? [],
      transitionedAt: new Date().toISOString()
    };

    this.records.push(record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "lifecycle",
      action: "lifecycle-transitioned",
      subjectId: input.subjectId,
      actorIdentityId: input.transitionedByIdentityId,
      outcome: "success",
      metadata: {
        fromStage,
        toStage: input.toStage,
        approvedByIdentityId: input.approvedByIdentityId
      }
    });

    return record;
  }

  history(subjectId: string) {
    return this.records
      .filter((record) => record.subjectId === subjectId)
      .sort((left, right) =>
        left.transitionedAt.localeCompare(right.transitionedAt)
      );
  }

  summary() {
    const latest = new Map<string, GovernanceLifecycleRecord>();

    for (const record of this.records) {
      latest.set(record.subjectId, record);
    }

    const records = Array.from(latest.values());

    return {
      governedAssets: records.length,
      transitions: this.records.length,
      concepts: records.filter(
        (item) => item.currentStage === "concept"
      ).length,
      platformServices: records.filter(
        (item) => item.currentStage === "platform-service"
      ).length,
      legacyAssets: records.filter(
        (item) => item.currentStage === "legacy-asset"
      ).length
    };
  }
}
