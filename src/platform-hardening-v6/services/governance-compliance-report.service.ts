import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  ComplianceFinding,
  ComplianceReportPayload,
} from "../interfaces/compliance-report.interface";
import { GovernanceIntegrityScannerService } from "./governance-integrity-scanner.service";
import { GovernanceRecordHashService } from "./governance-record-hash.service";
import { GovernanceReportRepository } from "./governance-report.repository";
import { GovernanceSignatureService } from "./governance-signature.service";
import { PersistentAuditLedgerService } from "./persistent-audit-ledger.service";
import { PolicyVersioningService } from "./policy-versioning.service";

@Injectable()
export class GovernanceComplianceReportService {
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
    reportType?: string;
    generatedBy?: string;
    correlationId?: string;
    traceId?: string;
  }) {
    const generatedAt =
      new Date();

    const reportType =
      input?.reportType ?? "full";

    const [
      auditSummary,
      auditIntegrity,
      policySummary,
      integritySummary,
    ] = await Promise.all([
      this.audit.getSummary(),
      this.audit.verifyIntegrity(),
      this.policies.getSummary(),
      this.scanner.getSummary(),
    ]);

    const latestScan =
      integritySummary.latestScan;

    const findings: ComplianceFinding[] = [
      {
        id: "audit-chain-integrity",
        category: "audit",
        severity:
          auditIntegrity.valid
            ? "info"
            : "critical",
        title:
          "Persistent audit hash chain",
        description:
          auditIntegrity.valid
            ? "The persistent audit hash chain is valid."
            : "The persistent audit hash chain failed integrity verification.",
        compliant:
          auditIntegrity.valid,
        evidence: {
          totalEvents:
            auditIntegrity.totalEvents,
          verifiedEvents:
            auditIntegrity.verifiedEvents,
        },
      },
      {
        id: "policy-versioning",
        category: "governance",
        severity:
          policySummary.totalPolicies > 0
            ? "info"
            : "warning",
        title:
          "Persistent policy registry",
        description:
          policySummary.totalPolicies > 0
            ? "Persistent policy versioning is operational."
            : "No persistent runtime policies were found.",
        compliant:
          policySummary.totalPolicies > 0,
        evidence: {
          ...policySummary,
        },
      },
      {
        id: "audit-signatures",
        category: "signatures",
        severity:
          latestScan?.auditSignaturesValid
            ? "info"
            : "error",
        title:
          "Audit digital signatures",
        description:
          latestScan?.auditSignaturesValid
            ? "All scanned audit signatures are valid."
            : "Audit signatures require attention or no scan is available.",
        compliant:
          Boolean(
            latestScan?.auditSignaturesValid,
          ),
        evidence: {
          latestScanId:
            latestScan?.id ?? null,
          unsignedRecords:
            latestScan?.unsignedAuditRecords ??
            null,
        },
      },
      {
        id: "policy-signatures",
        category: "signatures",
        severity:
          latestScan?.policySignaturesValid
            ? "info"
            : "error",
        title:
          "Policy digital signatures",
        description:
          latestScan?.policySignaturesValid
            ? "All scanned policy signatures are valid."
            : "Policy signatures require attention or no scan is available.",
        compliant:
          Boolean(
            latestScan?.policySignaturesValid,
          ),
        evidence: {
          latestScanId:
            latestScan?.id ?? null,
          unsignedRecords:
            latestScan?.unsignedPolicyRecords ??
            null,
        },
      },
      {
        id: "policy-checksums",
        category: "governance",
        severity:
          latestScan?.policyChecksumsValid
            ? "info"
            : "critical",
        title:
          "Policy checksum integrity",
        description:
          latestScan?.policyChecksumsValid
            ? "All scanned policy checksums are valid."
            : "Policy checksum validation requires attention.",
        compliant:
          Boolean(
            latestScan?.policyChecksumsValid,
          ),
        evidence: {
          latestScanId:
            latestScan?.id ?? null,
        },
      },
    ];

    const compliantChecks =
      findings.filter(
        (item) => item.compliant,
      ).length;

    const warningChecks =
      findings.filter(
        (item) =>
          !item.compliant &&
          item.severity === "warning",
      ).length;

    const failedChecks =
      findings.filter(
        (item) =>
          !item.compliant &&
          (
            item.severity === "error" ||
            item.severity === "critical"
          ),
      ).length;

    const compromised =
      latestScan?.status ===
        "compromised" ||
      !auditIntegrity.valid;

    const status =
      compromised
        ? "compromised"
        : failedChecks > 0 ||
            warningChecks > 0
          ? "attention_required"
          : "compliant";

    const recommendations =
      this.buildRecommendations(
        findings,
      );

    const payload:
      ComplianceReportPayload = {
        reportType,
        status,
        title:
          "AVOS Governance Compliance Snapshot",
        generatedAt:
          generatedAt.toISOString(),
        summary: {
          compliantChecks,
          warningChecks,
          failedChecks,
          totalChecks:
            findings.length,
        },
        findings,
        recommendations,
        metrics: {
          audit: auditSummary,
          policies: policySummary,
          integrity: latestScan
            ? {
                status:
                  latestScan.status,
                scanId:
                  latestScan.id,
                completedAt:
                  latestScan.completedAt,
              }
            : null,
        },
      };

    const checksum =
      this.hashes.create(payload);

    const signature =
      this.signatures.signPayload({
        checksum,
        payload,
      });

    const created =
      await this.repository
        .createCompliance({
          reportType,
          status,
          title: payload.title,
          summary:
            payload.summary as unknown as
              Prisma.InputJsonValue,
          findings:
            payload.findings as unknown as
              Prisma.InputJsonValue,
          recommendations:
            payload.recommendations as unknown as
              Prisma.InputJsonValue,
          metrics:
            payload.metrics as unknown as
              Prisma.InputJsonValue,
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
        "compliance_report",
      severity:
        status === "compliant"
          ? "info"
          : status ===
              "attention_required"
            ? "warning"
            : "critical",
      action:
        "governance-compliance-snapshot-created",
      message:
        `Governance compliance snapshot ${created.id} was generated with status ${status}`,
      actor:
        input?.generatedBy ??
        "platform-owner",
      correlationId:
        input?.correlationId,
      traceId:
        input?.traceId,
      metadata: {
        snapshotId:
          created.id,
        status,
        checksum,
        reportType,
      },
    });

    return created;
  }

  findAll(limit = 100) {
    return this.repository
      .findComplianceSnapshots(limit);
  }

  async findOne(id: string) {
    const item =
      await this.repository
        .findComplianceById(id);

    if (!item) {
      throw new NotFoundException({
        success: false,
        message:
          `Compliance snapshot ${id} was not found`,
      });
    }

    return item;
  }

  latest() {
    return this.repository
      .findLatestCompliance();
  }

  private buildRecommendations(
    findings: ComplianceFinding[],
  ): string[] {
    const recommendations: string[] = [];

    for (const finding of findings) {
      if (finding.compliant) {
        continue;
      }

      switch (finding.id) {
        case "audit-chain-integrity":
          recommendations.push(
            "Immediately investigate the persistent audit hash chain and suspend sensitive governance changes.",
          );
          break;

        case "audit-signatures":
          recommendations.push(
            "Run governance signature backfill and a full integrity scan.",
          );
          break;

        case "policy-signatures":
          recommendations.push(
            "Sign all unsigned policy versions and verify the configured signing key.",
          );
          break;

        case "policy-checksums":
          recommendations.push(
            "Review the affected policy versions for unauthorized modification.",
          );
          break;

        case "policy-versioning":
          recommendations.push(
            "Initialize the persistent runtime policy registry.",
          );
          break;
      }
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "No immediate remediation is required. Continue scheduled integrity scans.",
      );
    }

    return recommendations;
  }
}
