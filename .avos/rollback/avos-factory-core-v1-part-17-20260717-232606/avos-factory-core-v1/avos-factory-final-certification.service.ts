import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryFinalCertification
} from "./avos-factory-final-review.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryReleaseReadinessService
} from "./avos-factory-release-readiness.service";

@Injectable()
export class AvosFactoryFinalCertificationService {
  private latestRecord?:
    AvosFactoryFinalCertification;

  constructor(
    private readonly readiness:
      AvosFactoryReleaseReadinessService,
    private readonly audit:
      AvosFactoryAuditService
  ) {}

  async certify(input: {
    approvedBy: string;
    humanApproved: boolean;
  }): Promise<AvosFactoryFinalCertification> {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Final production certification requires Human Final Authority approval."
      );
    }

    const readiness =
      this.readiness.latest() ??
      await this.readiness.evaluate();

    const certified =
      readiness.ready &&
      readiness.score === 100 &&
      readiness.blockingFindings.length === 0;

    const record: AvosFactoryFinalCertification = {
      id: randomUUID(),
      system: "AVOS Factory Core V1",
      version: "1.0.0",
      status:
        certified
          ? "certified-for-production"
          : "rejected",
      score:
        readiness.score,
      releaseReadinessReportId:
        readiness.id,
      certifiedBy:
        "avos-factory:final-certification-engine",
      approvedBy:
        input.approvedBy,
      humanFinalAuthority: true,
      reasons:
        certified
          ? [
              "Architecture review passed.",
              "E2E validation passed.",
              "Operational readiness passed.",
              "Factory verification passed.",
              "Previous certification passed.",
              "Human Final Authority approved production certification."
            ]
          : readiness.blockingFindings.map(
              (finding) =>
                `Blocking readiness finding: ${finding}`
            ),
      certifiedAt:
        new Date().toISOString()
    };

    this.latestRecord =
      structuredClone(record);

    this.audit.append({
      category: "certification",
      action:
        certified
          ? "factory-final-certification-completed"
          : "factory-final-certification-rejected",
      actor:
        input.approvedBy,
      approvedBy:
        input.approvedBy,
      success:
        certified,
      resourceId:
        record.id,
      details: {
        score:
          record.score,
        releaseReadinessReportId:
          record.releaseReadinessReportId
      }
    });

    return record;
  }

  latest():
    | AvosFactoryFinalCertification
    | undefined {
    return this.latestRecord
      ? structuredClone(this.latestRecord)
      : undefined;
  }
}
