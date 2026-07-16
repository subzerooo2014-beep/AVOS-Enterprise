import { Injectable } from "@nestjs/common";
import {
  FoundationMaturityAssessment,
  FoundationMaturityLevel
} from "../foundation-pack-18.types";
import { FoundationComponentRegistryService } from "../registry/foundation-component-registry.service";
import { FoundationSelfValidationService } from "../validation/foundation-self-validation.service";
import { FoundationValidationAuditService } from "../observability/foundation-validation-audit.service";

@Injectable()
export class FoundationMaturityService {
  private readonly assessments =
    new Map<string, FoundationMaturityAssessment>();

  constructor(
    private readonly registry: FoundationComponentRegistryService,
    private readonly validation: FoundationSelfValidationService,
    private readonly audit: FoundationValidationAuditService
  ) {}

  list() {
    return Array.from(this.assessments.values());
  }

  assess(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const components = this.registry.list();
    const findings = this.validation.summary();

    const scoreFor = (ids: string[]) => {
      const selected = components.filter(
        (component) => ids.includes(component.id)
      );

      if (selected.length === 0) {
        return 0;
      }

      return Number(
        (
          selected.reduce(
            (sum, component) =>
              sum +
              (
                component.status === "present"
                  ? 100
                  : component.status === "partial"
                    ? 60
                    : component.status === "degraded"
                      ? 40
                      : 0
              ),
            0
          ) / selected.length
        ).toFixed(2)
      );
    };

    const dimensions = {
      architecture: scoreFor([
        "foundation:control-plane",
        "foundation:dependency-graph",
        "foundation:architecture",
        "foundation:evolution"
      ]),
      governance: scoreFor([
        "foundation:governance",
        "foundation:metadata",
        "foundation:digital-dna"
      ]),
      trust: scoreFor([
        "foundation:trust",
        "foundation:identity"
      ]),
      knowledge: scoreFor([
        "foundation:memory",
        "foundation:knowledge",
        "foundation:metadata"
      ]),
      intelligence: scoreFor([
        "foundation:architecture",
        "foundation:digital-genome"
      ]),
      operations: scoreFor([
        "foundation:sdk",
        "foundation:control-plane"
      ])
    };

    const score = Number(
      (
        Object.values(dimensions).reduce(
          (sum, value) => sum + value,
          0
        ) /
          Object.keys(dimensions).length -
        findings.critical * 10 -
        findings.errors * 5
      ).toFixed(2)
    );

    const normalizedScore = Math.max(
      0,
      Math.min(100, score)
    );

    const strengths: string[] = [];
    const gaps: string[] = [];

    for (const [dimension, value] of Object.entries(
      dimensions
    )) {
      if (value >= 80) {
        strengths.push(
          `${dimension} foundation is mature.`
        );
      }
      else {
        gaps.push(
          `${dimension} foundation requires improvement.`
        );
      }
    }

    const assessment: FoundationMaturityAssessment = {
      id: `foundation-maturity:${Date.now()}:${
        this.assessments.size + 1
      }`,
      level: this.level(normalizedScore),
      score: normalizedScore,
      dimensions,
      strengths,
      gaps,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(
      assessment.id,
      assessment
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "maturity",
      action: "foundation-maturity-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        normalizedScore < 60
          ? "warning"
          : "success",
      metadata: {
        level: assessment.level,
        score: assessment.score
      }
    });

    return assessment;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      latestLevel:
        items.length === 0
          ? "initial"
          : items[items.length - 1]?.level ?? "initial"
    };
  }

  private level(score: number): FoundationMaturityLevel {
    if (score >= 90) return "optimized";
    if (score >= 75) return "managed";
    if (score >= 60) return "defined";
    if (score >= 40) return "developing";
    return "initial";
  }
}
