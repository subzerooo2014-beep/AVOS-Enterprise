import { Injectable } from "@nestjs/common";
import {
  FoundationReadinessAssessment
} from "../foundation-pack-18.types";
import { FoundationComponentRegistryService } from "../registry/foundation-component-registry.service";
import { FoundationSelfValidationService } from "../validation/foundation-self-validation.service";
import { FoundationConsistencyService } from "../consistency/foundation-consistency.service";
import { FoundationMaturityService } from "../maturity/foundation-maturity.service";
import { FoundationValidationAuditService } from "../observability/foundation-validation-audit.service";

@Injectable()
export class FoundationReadinessService {
  private readonly assessments =
    new Map<string, FoundationReadinessAssessment>();

  constructor(
    private readonly registry: FoundationComponentRegistryService,
    private readonly validation: FoundationSelfValidationService,
    private readonly consistency: FoundationConsistencyService,
    private readonly maturity: FoundationMaturityService,
    private readonly audit: FoundationValidationAuditService
  ) {}

  list() {
    return Array.from(this.assessments.values());
  }

  assess(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const validationResult =
      this.validation.validate(input);

    const consistencyResult =
      this.consistency.check(input);

    const maturityResult =
      this.maturity.assess(input);

    const required = this.registry.required();
    const present = required.filter(
      (component) => component.status === "present"
    ).length;

    const componentScore =
      required.length === 0
        ? 100
        : Number(
            (
              present /
              required.length *
              100
            ).toFixed(2)
          );

    const validationScore = Math.max(
      0,
      100 -
        this.validation.summary().critical * 30 -
        this.validation.summary().errors * 15 -
        this.validation.summary().warnings * 5
    );

    const consistencyScore =
      consistencyResult.consistent ? 100 : 40;

    const maturityScore = maturityResult.score;

    const score = Number(
      (
        componentScore * 0.35 +
        validationScore * 0.25 +
        consistencyScore * 0.2 +
        maturityScore * 0.2
      ).toFixed(2)
    );

    const blockers: string[] = [];
    const warnings: string[] = [];

    if (present < required.length) {
      blockers.push(
        "Not all required foundation components are present."
      );
    }

    for (const finding of validationResult.findings) {
      if (
        finding.severity === "critical" ||
        finding.severity === "error"
      ) {
        blockers.push(finding.message);
      }
      else {
        warnings.push(finding.message);
      }
    }

    if (!consistencyResult.consistent) {
      blockers.push(
        "Foundation consistency validation failed."
      );
    }

    if (maturityScore < 60) {
      blockers.push(
        "Foundation maturity is below the minimum threshold."
      );
    }
    else if (maturityScore < 75) {
      warnings.push(
        "Foundation maturity is acceptable but not managed."
      );
    }

    const assessment: FoundationReadinessAssessment = {
      id: `foundation-readiness:${Date.now()}:${
        this.assessments.size + 1
      }`,
      score,
      ready:
        blockers.length === 0 &&
        score >= 80,
      blockers: Array.from(new Set(blockers)),
      warnings: Array.from(new Set(warnings)),
      requiredComponentsPresent: present,
      requiredComponentsTotal: required.length,
      validationScore,
      consistencyScore,
      maturityScore,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(
      assessment.id,
      assessment
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "readiness",
      action: "foundation-readiness-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.actorIdentityId,
      outcome: assessment.ready
        ? "success"
        : "blocked",
      metadata: {
        score: assessment.score,
        ready: assessment.ready,
        blockers: assessment.blockers
      }
    });

    return assessment;
  }

  summary() {
    const assessments = this.list();

    return {
      total: assessments.length,
      ready: assessments.filter(
        (assessment) => assessment.ready
      ).length,
      latestScore:
        assessments.length === 0
          ? 0
          : assessments[assessments.length - 1]
              ?.score ?? 0
    };
  }
}
