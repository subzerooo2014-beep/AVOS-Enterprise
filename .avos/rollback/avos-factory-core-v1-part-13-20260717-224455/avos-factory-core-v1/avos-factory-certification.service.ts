import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryCertificationRecord
} from "./avos-factory-runtime.contracts";
import {
  AvosFactoryVerificationService
} from "./avos-factory-verification.service";

@Injectable()
export class AvosFactoryCertificationService {
  private latestRecord?: AvosFactoryCertificationRecord;

  constructor(
    private readonly verification:
      AvosFactoryVerificationService
  ) {}

  async certify(input: {
    approvedBy: string;
    humanApproved: boolean;
  }): Promise<AvosFactoryCertificationRecord> {
    if (
      input.humanApproved !== true ||
      !input.approvedBy?.trim()
    ) {
      throw new BadRequestException(
        "Certification requires Human Final Authority approval."
      );
    }

    const report =
      this.verification.latest() ??
      await this.verification.run();

    const certified =
      report.passed &&
      report.score === 100 &&
      report.blockingFindings.length === 0;

    const record: AvosFactoryCertificationRecord = {
      id: randomUUID(),
      verificationReportId: report.id,
      system: "AVOS Factory Core V1",
      status:
        certified
          ? "certified"
          : "rejected",
      score: report.score,
      certifiedBy:
        "avos-factory:certification-engine",
      approvedBy:
        input.approvedBy,
      humanFinalAuthority: true,
      certifiedAt:
        new Date().toISOString(),
      reasons:
        certified
          ? [
              "All AVOS Factory Core V1 verification checks passed.",
              "Controlled project generation and rollback smoke test passed.",
              "Human Final Authority is preserved."
            ]
          : [
              ...report.blockingFindings.map(
                (finding) =>
                  `Blocking verification finding: ${finding}`
              )
            ]
    };

    this.latestRecord =
      structuredClone(record);

    return record;
  }

  latest(): AvosFactoryCertificationRecord | undefined {
    return this.latestRecord
      ? structuredClone(this.latestRecord)
      : undefined;
  }
}
