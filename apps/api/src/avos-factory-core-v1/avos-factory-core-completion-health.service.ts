import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryCoreCompletionHealthReport
} from "./avos-factory-core-completion.contracts";
import {
  AvosFactoryCoreCompletionValidationService
} from "./avos-factory-core-completion-validation.service";
import {
  AvosFactoryCoreCompletionCertificationService
} from "./avos-factory-core-completion-certification.service";

@Injectable()
export class AvosFactoryCoreCompletionHealthService {
  constructor(
    private readonly validation: AvosFactoryCoreCompletionValidationService,
    private readonly certification: AvosFactoryCoreCompletionCertificationService
  ) {}

  calculate(): AvosFactoryCoreCompletionHealthReport {
    const validation = this.validation.latest();
    const certification = this.certification.latest();

    const metrics: Record<string, number> = {
      validationScore: validation?.score ?? 0,
      certificationScore:
        certification?.status === "certified"
          ? certification.score
          : 0,
      humanAuthorityScore:
        certification?.humanApproved === true
          ? 100
          : 0,
      blockingFindingsScore:
        validation && validation.blockingFindings.length === 0
          ? 100
          : 0
    };

    const values = Object.values(metrics);

    const score = Math.round(
      values.reduce((total, value) => total + value, 0) /
      values.length
    );

    const level =
      score >= 95
        ? "excellent"
        : score >= 85
          ? "healthy"
          : score >= 70
            ? "degraded"
            : "critical";

    const reasons: string[] = [];

    if (level === "excellent") {
      reasons.push(
        "AVOS Factory Core V1 is fully validated, certified, governed, and healthy."
      );
    }
    else {
      if (!validation) {
        reasons.push("Final validation report is missing.");
      }

      if (!certification) {
        reasons.push("Final certification is missing.");
      }

      if (
        validation &&
        validation.blockingFindings.length > 0
      ) {
        reasons.push(
          `Blocking findings remain: ${validation.blockingFindings.join(", ")}.`
        );
      }
    }

    return {
      id: randomUUID(),
      score,
      level,
      metrics,
      reasons,
      calculatedAt: new Date().toISOString()
    };
  }
}
