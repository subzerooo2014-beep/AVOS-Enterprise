import { Injectable } from "@nestjs/common";
import {
  CompatibilityAssessment,
  CompatibilityStatus
} from "../foundation-pack-10.types";
import { BlueprintDiffEngineService } from "../diff/blueprint-diff-engine.service";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class ArchitectureCompatibilityValidatorService {
  private readonly assessments =
    new Map<string, CompatibilityAssessment>();

  constructor(
    private readonly diff: BlueprintDiffEngineService,
    private readonly audit: ArchitectureAuditService
  ) {}

  list() {
    return Array.from(this.assessments.values());
  }

  assess(input: {
    blueprintId: string;
    sourceVersion: string;
    targetVersion: string;
    assessedByIdentityId: string;
    correlationId: string;
  }) {
    const diff = this.diff.compare({
      blueprintId: input.blueprintId,
      fromVersion: input.sourceVersion,
      toVersion: input.targetVersion,
      actorIdentityId: input.assessedByIdentityId,
      correlationId: input.correlationId
    });

    const reasons: string[] = [];
    let status: CompatibilityStatus = "compatible";

    if (diff.breakingChanges.length > 0) {
      status = "incompatible";
      reasons.push(...diff.breakingChanges);
    }
    else if (
      diff.entries.some(
        (entry) => entry.changeType === "modified"
      )
    ) {
      status = "conditionally-compatible";
      reasons.push(
        "Modified architecture assets require validation."
      );
    }
    else {
      reasons.push(
        "No breaking architecture changes detected."
      );
    }

    const assessment: CompatibilityAssessment = {
      id: `compatibility-assessment:${Date.now()}:${
        this.assessments.size + 1
      }`,
      blueprintId: input.blueprintId,
      sourceVersion: input.sourceVersion,
      targetVersion: input.targetVersion,
      status,
      reasons,
      breakingChanges: diff.breakingChanges,
      assessedByIdentityId: input.assessedByIdentityId,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(
      assessment.id,
      assessment
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "compatibility",
      action: "architecture-compatibility-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.assessedByIdentityId,
      outcome:
        status === "incompatible"
          ? "blocked"
          : status === "conditionally-compatible"
            ? "warning"
            : "success",
      metadata: {
        status,
        breakingChanges: diff.breakingChanges
      }
    });

    return assessment;
  }

  summary() {
    const assessments = this.list();

    return {
      total: assessments.length,
      compatible: assessments.filter(
        (assessment) =>
          assessment.status === "compatible"
      ).length,
      conditional: assessments.filter(
        (assessment) =>
          assessment.status ===
          "conditionally-compatible"
      ).length,
      incompatible: assessments.filter(
        (assessment) =>
          assessment.status === "incompatible"
      ).length
    };
  }
}
