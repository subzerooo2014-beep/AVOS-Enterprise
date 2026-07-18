import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryCertificationAssessment,
  AvosFactoryCertificationCriterion,
  AvosFactoryCertificationEvidence
} from "./avos-factory-certification-integration.contracts";
import {
  AvosFactoryCertificationCriteriaRegistryService
} from "./avos-factory-certification-criteria-registry.service";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";
import {
  AvosFactoryValidationEngineService
} from "./avos-factory-validation-engine.service";
import {
  AvosFactorySecurityAssessmentService
} from "./avos-factory-security-assessment.service";
import {
  AvosFactoryReleaseReadinessService
} from "./avos-factory-release-readiness.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryCertificationAssessmentService {
  private readonly assessments: AvosFactoryCertificationAssessment[] = [];

  constructor(
    private readonly criteria: AvosFactoryCertificationCriteriaRegistryService,
    private readonly analyzer: AvosFactoryGenerationAnalyzerService,
    private readonly validation: AvosFactoryValidationEngineService,
    private readonly security: AvosFactorySecurityAssessmentService,
    private readonly readiness: AvosFactoryReleaseReadinessService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  async assess(input: {
    subjectId: string;
    actor: string;
    governanceScore?: number;
    operabilityScore?: number;
    documentationScore?: number;
  }): Promise<AvosFactoryCertificationAssessment> {
    const analysis = this.analyzer.findBySubject(input.subjectId)[0];
    const validation = this.validation.latestForSubject(input.subjectId);
    const security = this.security
      .list(1000)
      .find((candidate) => candidate.subjectId === input.subjectId);

    const readiness =
      this.readiness.latest() ??
      await this.readiness.evaluate();

    const values: Record<
      AvosFactoryCertificationCriterion["category"],
      number
    > = {
      quality: analysis?.quality.overall ?? 0,
      validation: validation?.score ?? 0,
      security: security?.score ?? analysis?.quality.security ?? 0,
      governance: Math.max(
        0,
        Math.min(100, input.governanceScore ?? 100)
      ),
      operability: Math.max(
        0,
        Math.min(
          100,
          input.operabilityScore ?? analysis?.quality.reliability ?? 0
        )
      ),
      documentation: Math.max(
        0,
        Math.min(
          100,
          input.documentationScore ?? analysis?.quality.documentation ?? 0
        )
      )
    };

    const criteria = this.criteria.list();

    const evidence: AvosFactoryCertificationEvidence[] =
      criteria.map((criterion) => {
        const score = values[criterion.category];

        return {
          criterionId: criterion.id,
          category: criterion.category,
          score,
          minimumScore: criterion.minimumScore,
          passed: score >= criterion.minimumScore,
          notes: [
            `${criterion.category} score is ${score}.`,
            `Minimum required score is ${criterion.minimumScore}.`
          ]
        };
      });

    const blockingCriteria = criteria
      .filter((criterion) => criterion.required)
      .filter((criterion) => {
        const item = evidence.find(
          (candidate) => candidate.criterionId === criterion.id
        );

        return !item?.passed;
      })
      .map((criterion) => criterion.name);

    const score =
      evidence.length === 0
        ? 0
        : Math.round(
            evidence.reduce((sum, item) => sum + item.score, 0) /
            evidence.length
          );

    const assessment: AvosFactoryCertificationAssessment = {
      id: randomUUID(),
      subjectId: input.subjectId,
      actor: input.actor,
      score,
      status:
        blockingCriteria.length === 0 && score >= 85
          ? "eligible"
          : "rejected",
      evidence,
      blockingCriteria,
      releaseReadinessId:
        typeof readiness === "object" &&
        readiness !== null &&
        "id" in readiness &&
        typeof readiness.id === "string"
          ? readiness.id
          : undefined,
      generatedAt: new Date().toISOString()
    };

    this.assessments.unshift(assessment);

    this.audit.append({
      category: "certification",
      action: "factory-certification-assessed",
      actor: input.actor,
      success: assessment.status === "eligible",
      resourceId: assessment.id,
      details: {
        subjectId: input.subjectId,
        score,
        blockingCriteria,
        releaseReadinessId: assessment.releaseReadinessId
      }
    });

    return structuredClone(assessment);
  }

  list(limit = 100): AvosFactoryCertificationAssessment[] {
    return this.assessments
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((assessment) => structuredClone(assessment));
  }

  get(
    assessmentId: string
  ): AvosFactoryCertificationAssessment | undefined {
    const assessment = this.assessments.find(
      (candidate) => candidate.id === assessmentId
    );

    return assessment ? structuredClone(assessment) : undefined;
  }
}
