import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { EvidencePackagePayload } from "../interfaces/evidence-package.interface";
import { GovernanceIntegrityScannerService } from "./governance-integrity-scanner.service";
import { GovernanceRecordHashService } from "./governance-record-hash.service";
import { GovernanceReportRepository } from "./governance-report.repository";
import { GovernanceSignatureService } from "./governance-signature.service";
import { PersistentAuditLedgerService } from "./persistent-audit-ledger.service";
import { PolicyVersioningService } from "./policy-versioning.service";

@Injectable()
export class GovernanceEvidenceVaultService {
  constructor(
    private readonly audit:
      PersistentAuditLedgerService,
    private readonly policies:
      PolicyVersioningService,
    private readonly scanner:
      GovernanceIntegrityScannerService,
    private readonly repository:
      GovernanceReportRepository,
    private readonly hashes:
      GovernanceRecordHashService,
    private readonly signatures:
      GovernanceSignatureService,
  ) {}

  async generate(input?: {
    packageType?: string;
    description?: string;
    generatedBy?: string;
    correlationId?: string;
    traceId?: string;
  }) {
    const generatedAt =
      new Date();

    const packageType =
      input?.packageType ??
      "full_governance";

    const evidence: Array<{
      type: string;
      source: string;
      data: unknown;
    }> = [];

    if (
      packageType ===
        "full_governance" ||
      packageType ===
        "audit_evidence"
    ) {
      evidence.push({
        type: "audit_summary",
        source:
          "persistent-audit-ledger",
        data:
          await this.audit.getSummary(),
      });

      evidence.push({
        type: "audit_integrity",
        source:
          "persistent-audit-ledger",
        data:
          await this.audit
            .verifyIntegrity(),
      });

      evidence.push({
        type: "recent_audit_events",
        source:
          "persistent-audit-ledger",
        data:
          await this.audit.findMany({
            limit: 250,
          }),
      });
    }

    if (
      packageType ===
        "full_governance" ||
      packageType ===
        "policy_evidence"
    ) {
      evidence.push({
        type: "policy_summary",
        source:
          "persistent-policy-registry",
        data:
          await this.policies.getSummary(),
      });

      evidence.push({
        type: "policies",
        source:
          "persistent-policy-registry",
        data:
          await this.policies.findAll(),
      });
    }

    if (
      packageType ===
        "full_governance" ||
      packageType ===
        "integrity_evidence"
    ) {
      evidence.push({
        type: "integrity_summary",
        source:
          "governance-integrity-scanner",
        data:
          await this.scanner.getSummary(),
      });

      evidence.push({
        type: "integrity_history",
        source:
          "governance-integrity-scanner",
        data:
          await this.scanner.getHistory(
            100,
          ),
      });
    }

    const payload:
      EvidencePackagePayload = {
        packageType,
        title:
          "AVOS Security and Governance Evidence Package",
        scope: packageType,
        generatedAt:
          generatedAt.toISOString(),
        evidence,
        metadata: {
          system:
            "AVOS Enterprise Production",
          hardeningVersion:
            "v6",
          formatVersion:
            "1.0",
        },
      };

    const checksum =
      this.hashes.create(payload);

    const signature =
      this.signatures.signPayload({
        checksum,
        payload,
      });

    const status =
      this.determineStatus(evidence);

    const created =
      await this.repository
        .createEvidence({
          packageType,
          status,
          title: payload.title,
          description:
            input?.description,
          scope: packageType,
          evidenceCount:
            evidence.length,
          payload:
            payload as unknown as
              Prisma.InputJsonValue,
          checksum,
          signature:
            signature.signature,
          signatureAlgorithm:
            signature.algorithm,
          signatureKeyId:
            signature.keyId,
          generatedBy:
            input?.generatedBy ??
            "platform-owner",
          correlationId:
            input?.correlationId,
          traceId:
            input?.traceId,
          generatedAt,
          signedAt:
            new Date(
              signature.signedAt,
            ),
        });

    await this.audit.append({
      eventType:
        "security_evidence",
      severity: "info",
      action:
        "governance-evidence-package-created",
      message:
        `Governance evidence package ${created.id} was generated`,
      actor:
        input?.generatedBy ??
        "platform-owner",
      correlationId:
        input?.correlationId,
      traceId:
        input?.traceId,
      metadata: {
        packageId:
          created.id,
        packageType,
        evidenceCount:
          evidence.length,
        checksum,
      },
    });

    return created;
  }

  findAll(limit = 100) {
    return this.repository
      .findEvidencePackages(limit);
  }

  async findOne(id: string) {
    const item =
      await this.repository
        .findEvidenceById(id);

    if (!item) {
      throw new NotFoundException({
        success: false,
        message:
          `Evidence package ${id} was not found`,
      });
    }

    return item;
  }

  latest() {
    return this.repository
      .findLatestEvidence();
  }

  private determineStatus(
    evidence: Array<{
      type: string;
      source: string;
      data: unknown;
    }>,
  ): string {
    const serialized =
      JSON.stringify(evidence);

    if (
      serialized.includes(
        '"status":"compromised"',
      ) ||
      serialized.includes(
        '"valid":false',
      )
    ) {
      return "compromised";
    }

    if (
      serialized.includes(
        '"status":"warning"',
      )
    ) {
      return "attention_required";
    }

    return "verified";
  }
}
