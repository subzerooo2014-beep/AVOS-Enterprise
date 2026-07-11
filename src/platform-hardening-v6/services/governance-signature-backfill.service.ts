import {
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import { GovernanceIntegrityRepository } from "./governance-integrity.repository";
import { GovernanceSignaturePayloadService } from "./governance-signature-payload.service";
import { GovernanceSignatureService } from "./governance-signature.service";

@Injectable()
export class GovernanceSignatureBackfillService
  implements OnModuleInit
{
  constructor(
    private readonly repository:
      GovernanceIntegrityRepository,
    private readonly payloads:
      GovernanceSignaturePayloadService,
    private readonly signatures:
      GovernanceSignatureService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.backfillAll();
  }

  async backfillAll() {
    const auditCount =
      await this.backfillAudit();

    const policyCount =
      await this.backfillPolicies();

    return {
      auditRecordsSigned:
        auditCount,
      policyVersionsSigned:
        policyCount,
      completedAt:
        new Date().toISOString(),
    };
  }

  private async backfillAudit(): Promise<number> {
    let total = 0;

    while (true) {
      const records =
        await this.repository
          .findUnsignedAudit(500);

      if (records.length === 0) {
        break;
      }

      for (const record of records) {
        const signature =
          this.signatures.signPayload(
            this.payloads.audit(record),
          );

        await this.repository
          .updateAuditSignature(
            record.id,
            {
              signature:
                signature.signature,
              signatureAlgorithm:
                signature.algorithm,
              signatureKeyId:
                signature.keyId,
              signedAt:
                new Date(
                  signature.signedAt,
                ),
            },
          );

        total += 1;
      }
    }

    return total;
  }

  private async backfillPolicies(): Promise<number> {
    let total = 0;

    while (true) {
      const records =
        await this.repository
          .findUnsignedPolicyVersions(500);

      if (records.length === 0) {
        break;
      }

      for (const record of records) {
        const signature =
          this.signatures.signPayload(
            this.payloads.policy(record),
          );

        await this.repository
          .updatePolicySignature(
            record.id,
            {
              policySignature:
                signature.signature,
              signatureAlgorithm:
                signature.algorithm,
              signatureKeyId:
                signature.keyId,
              signedAt:
                new Date(
                  signature.signedAt,
                ),
            },
          );

        total += 1;
      }
    }

    return total;
  }
}
