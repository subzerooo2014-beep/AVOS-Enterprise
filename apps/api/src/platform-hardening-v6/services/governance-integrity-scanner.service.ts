import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PersistentAuditHashUtil } from "../utils/persistent-audit-hash.util";
import { PolicyChecksumService } from "./policy-checksum.service";
import { GovernanceIntegrityRepository } from "./governance-integrity.repository";
import { GovernanceSignaturePayloadService } from "./governance-signature-payload.service";
import { GovernanceSignatureService } from "./governance-signature.service";
import { GovernanceIntegrityScanResult } from "../interfaces/governance-integrity-scan-result.interface";

@Injectable()
export class GovernanceIntegrityScannerService {
  constructor(
    private readonly repository:
      GovernanceIntegrityRepository,
    private readonly signatures:
      GovernanceSignatureService,
    private readonly payloads:
      GovernanceSignaturePayloadService,
    private readonly checksums:
      PolicyChecksumService,
  ) {}

  async run(input?: {
    scope?: "all" | "audit" | "policies";
    executedBy?: string;
    correlationId?: string;
    traceId?: string;
  }) {
    const startedAt =
      new Date();

    const scope =
      input?.scope ?? "all";

    const result:
      GovernanceIntegrityScanResult = {
        status: "healthy",
        scope,
        audit: {
          total: 0,
          verified: 0,
          hashChainValid: true,
          signaturesValid: true,
          unsignedRecords: 0,
        },
        policies: {
          total: 0,
          verified: 0,
          checksumsValid: true,
          signaturesValid: true,
          unsignedRecords: 0,
        },
        startedAt:
          startedAt.toISOString(),
        completedAt: "",
      };

    if (
      scope === "all" ||
      scope === "audit"
    ) {
      await this.scanAudit(result);
    }

    if (
      scope === "all" ||
      scope === "policies"
    ) {
      await this.scanPolicies(result);
    }

    if (result.compromised) {
      result.status = "compromised";
    } else if (
      result.audit.unsignedRecords > 0 ||
      result.policies.unsignedRecords > 0
    ) {
      result.status = "warning";
    }

    const completedAt =
      new Date();

    result.completedAt =
      completedAt.toISOString();

    await this.repository.createScan({
      status: result.status,
      scope,
      auditTotal:
        result.audit.total,
      auditVerified:
        result.audit.verified,
      auditHashValid:
        result.audit.hashChainValid,
      auditSignaturesValid:
        result.audit.signaturesValid,
      policyTotal:
        result.policies.total,
      policyVerified:
        result.policies.verified,
      policyChecksumsValid:
        result.policies.checksumsValid,
      policySignaturesValid:
        result.policies.signaturesValid,
      unsignedAuditRecords:
        result.audit.unsignedRecords,
      unsignedPolicyRecords:
        result.policies.unsignedRecords,
      compromisedRecordType:
        result.compromised
          ?.recordType,
      compromisedRecordId:
        result.compromised
          ?.recordId,
      compromisedSequence:
        result.compromised
          ?.sequence,
      details:
        result as unknown as
          Prisma.InputJsonValue,
      executedBy:
        input?.executedBy ??
        "platform-owner",
      correlationId:
        input?.correlationId,
      traceId:
        input?.traceId,
      startedAt,
      completedAt,
    });

    return result;
  }

  async getSummary() {
    const latest =
      await this.repository
        .findLatestScan();

    return {
      latestScan: latest,
      signatureConfiguration:
        this.signatures
          .getConfiguration(),
    };
  }

  getHistory(limit = 100) {
    return this.repository
      .findScans(limit);
  }

  private async scanAudit(
    result: GovernanceIntegrityScanResult,
  ): Promise<void> {
    const records =
      await this.repository
        .findAuditAscending();

    result.audit.total =
      records.length;

    let previousHash = "GENESIS";

    for (const record of records) {
      if (
        !record.signature ||
        !record.signedAt ||
        !record.signatureKeyId ||
        !record.signatureAlgorithm
      ) {
        result.audit
          .unsignedRecords += 1;
        result.audit
          .signaturesValid = false;
      }

      const expectedHash =
        PersistentAuditHashUtil.create({
          sequence: record.sequence,
          eventType:
            record.eventType,
          severity:
            record.severity,
          action: record.action,
          message: record.message,
          actor: record.actor,
          correlationId:
            record.correlationId,
          traceId:
            record.traceId,
          method: record.method,
          path: record.path,
          statusCode:
            record.statusCode,
          metadata:
            record.metadata,
          previousHash,
          createdAt:
            record.createdAt,
        });

      if (
        record.previousHash !==
          previousHash ||
        record.hash !==
          expectedHash
      ) {
        result.audit
          .hashChainValid = false;

        result.compromised = {
          recordType: "audit",
          recordId: record.id,
          sequence:
            record.sequence,
          reason:
            "Audit hash chain verification failed",
        };

        return;
      }

      if (
        record.signature &&
        record.signedAt
      ) {
        const validSignature =
          this.signatures.verifyPayload({
            payload:
              this.payloads.audit(
                record,
              ),
            signature:
              record.signature,
            signedAt:
              record.signedAt,
            algorithm:
              record.signatureAlgorithm,
            keyId:
              record.signatureKeyId,
          });

        if (!validSignature) {
          result.audit
            .signaturesValid = false;

          result.compromised = {
            recordType: "audit",
            recordId: record.id,
            sequence:
              record.sequence,
            reason:
              "Audit digital signature verification failed",
          };

          return;
        }
      }

      previousHash =
        record.hash;

      result.audit.verified += 1;
    }
  }

  private async scanPolicies(
    result: GovernanceIntegrityScanResult,
  ): Promise<void> {
    const versions =
      await this.repository
        .findPolicyVersionsAscending();

    result.policies.total =
      versions.length;

    for (const version of versions) {
      if (
        !version.policySignature ||
        !version.signedAt ||
        !version.signatureKeyId ||
        !version.signatureAlgorithm
      ) {
        result.policies
          .unsignedRecords += 1;
        result.policies
          .signaturesValid = false;
      }

      const checksum =
        this.checksums.create({
          id: version.policyId,
          name: version.name,
          description:
            version.description,
          enabled:
            version.enabled,
          methods:
            this.toStringArray(
              version.methods,
            ),
          pathPrefixes:
            this.toStringArray(
              version.pathPrefixes,
            ),
          requireApprovalToken:
            version.requireApprovalToken,
          blockInProduction:
            version.blockInProduction,
          severity:
            version.severity,
        });

      if (
        checksum !==
        version.checksum
      ) {
        result.policies
          .checksumsValid = false;

        result.compromised = {
          recordType: "policy",
          recordId: version.id,
          reason:
            `Policy checksum verification failed for ${version.policyId} version ${version.version}`,
        };

        return;
      }

      if (
        version.policySignature &&
        version.signedAt
      ) {
        const validSignature =
          this.signatures.verifyPayload({
            payload:
              this.payloads.policy(
                version,
              ),
            signature:
              version.policySignature,
            signedAt:
              version.signedAt,
            algorithm:
              version.signatureAlgorithm,
            keyId:
              version.signatureKeyId,
          });

        if (!validSignature) {
          result.policies
            .signaturesValid = false;

          result.compromised = {
            recordType: "policy",
            recordId: version.id,
            reason:
              `Policy digital signature verification failed for ${version.policyId} version ${version.version}`,
          };

          return;
        }
      }

      result.policies.verified += 1;
    }
  }

  private toStringArray(
    value: unknown,
  ): string[] {
    return Array.isArray(value)
      ? value.map(String)
      : [];
  }
}
