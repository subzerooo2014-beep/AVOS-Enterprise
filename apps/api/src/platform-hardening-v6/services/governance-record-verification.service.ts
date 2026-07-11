import { Injectable } from "@nestjs/common";
import { SignedRecordVerification } from "../interfaces/signed-record-verification.interface";
import { GovernanceRecordHashService } from "./governance-record-hash.service";
import { GovernanceReportRepository } from "./governance-report.repository";
import { GovernanceSignatureService } from "./governance-signature.service";

@Injectable()
export class GovernanceRecordVerificationService {
  constructor(
    private readonly repository:
      GovernanceReportRepository,
    private readonly hashes:
      GovernanceRecordHashService,
    private readonly signatures:
      GovernanceSignatureService,
  ) {}

  async verifyCompliance(
    id: string,
  ): Promise<SignedRecordVerification> {
    const record =
      await this.repository
        .findComplianceById(id);

    if (!record) {
      return this.missing(
        id,
        "compliance_snapshot",
      );
    }

    const checksum =
      this.hashes.create(
        record.payload,
      );

    const checksumValid =
      checksum === record.checksum;

    const signatureValid =
      this.signatures.verifyPayload({
        payload: {
          checksum:
            record.checksum,
          payload:
            record.payload,
        },
        signature:
          record.signature,
        signedAt:
          record.signedAt,
        algorithm:
          record.signatureAlgorithm,
        keyId:
          record.signatureKeyId,
      });

    return {
      valid:
        checksumValid &&
        signatureValid,
      checksumValid,
      signatureValid,
      recordId: id,
      recordType:
        "compliance_snapshot",
      checkedAt:
        new Date().toISOString(),
    };
  }

  async verifyEvidence(
    id: string,
  ): Promise<SignedRecordVerification> {
    const record =
      await this.repository
        .findEvidenceById(id);

    if (!record) {
      return this.missing(
        id,
        "evidence_package",
      );
    }

    const checksum =
      this.hashes.create(
        record.payload,
      );

    const checksumValid =
      checksum === record.checksum;

    const signatureValid =
      this.signatures.verifyPayload({
        payload: {
          checksum:
            record.checksum,
          payload:
            record.payload,
        },
        signature:
          record.signature,
        signedAt:
          record.signedAt,
        algorithm:
          record.signatureAlgorithm,
        keyId:
          record.signatureKeyId,
      });

    return {
      valid:
        checksumValid &&
        signatureValid,
      checksumValid,
      signatureValid,
      recordId: id,
      recordType:
        "evidence_package",
      checkedAt:
        new Date().toISOString(),
    };
  }

  private missing(
    id: string,
    type:
      | "compliance_snapshot"
      | "evidence_package",
  ): SignedRecordVerification {
    return {
      valid: false,
      checksumValid: false,
      signatureValid: false,
      recordId: id,
      recordType: type,
      checkedAt:
        new Date().toISOString(),
    };
  }
}
