import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryCoreCompletionCertification
} from "./avos-factory-core-completion.contracts";
import {
  AvosFactoryCoreCompletionValidationService
} from "./avos-factory-core-completion-validation.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryCoreCompletionCertificationService {
  private readonly certifications: AvosFactoryCoreCompletionCertification[] = [];

  constructor(
    private readonly validation: AvosFactoryCoreCompletionValidationService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  certify(input: {
    validationReportId: string;
    certifiedBy: string;
    approvedBy: string;
    humanApproved: boolean;
  }): AvosFactoryCoreCompletionCertification {
    if (!input.humanApproved || !input.approvedBy?.trim()) {
      throw new BadRequestException(
        "Final certification requires Human Final Authority approval."
      );
    }

    const report = this.validation.get(input.validationReportId);

    if (!report) {
      throw new BadRequestException(
        `Final validation report not found: ${input.validationReportId}`
      );
    }

    if (
      report.status !== "passed" ||
      report.score !== 100 ||
      report.blockingFindings.length > 0
    ) {
      throw new BadRequestException(
        "Only a fully passed validation report can be certified."
      );
    }

    const existing = this.certifications.find(
      (candidate) =>
        candidate.validationReportId === report.id &&
        candidate.status === "certified"
    );

    if (existing) {
      return structuredClone(existing);
    }

    const certification: AvosFactoryCoreCompletionCertification = {
      id: randomUUID(),
      validationReportId: report.id,
      subjectId: report.subjectId,
      version: report.version,
      status: "certified",
      score: report.score,
      certifiedBy: input.certifiedBy,
      approvedBy: input.approvedBy,
      humanApproved: true,
      issuedAt: new Date().toISOString()
    };

    this.certifications.unshift(certification);

    this.audit.append({
      category: "certification",
      action: "factory-core-v1-finally-certified",
      actor: input.certifiedBy,
      approvedBy: input.approvedBy,
      success: true,
      resourceId: certification.id,
      details: {
        validationReportId: report.id,
        subjectId: report.subjectId,
        version: report.version,
        score: report.score
      }
    });

    return structuredClone(certification);
  }

  latest(): AvosFactoryCoreCompletionCertification | undefined {
    const certification = this.certifications[0];
    return certification ? structuredClone(certification) : undefined;
  }

  list(limit = 100): AvosFactoryCoreCompletionCertification[] {
    return this.certifications
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((certification) => structuredClone(certification));
  }
}
