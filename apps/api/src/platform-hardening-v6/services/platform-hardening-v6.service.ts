import { Injectable } from "@nestjs/common";
import { GovernanceIntegrityScannerService } from "./governance-integrity-scanner.service";
import { GovernanceReportRepository } from "./governance-report.repository";
import { GovernanceSignatureService } from "./governance-signature.service";
import { PersistentAuditLedgerService } from "./persistent-audit-ledger.service";
import { PolicyVersioningService } from "./policy-versioning.service";

@Injectable()
export class PlatformHardeningV6Service {
  constructor(
    private readonly audit:
      PersistentAuditLedgerService,
    private readonly policies:
      PolicyVersioningService,
    private readonly scanner:
      GovernanceIntegrityScannerService,
    private readonly signatures:
      GovernanceSignatureService,
    private readonly reports:
      GovernanceReportRepository,
  ) {}

  getStatus() {
    return {
      success: true,
      system:
        "AVOS Platform Hardening",
      version: "v6",
      phase:
        "persistent-signed-governance-compliance-and-evidence-vault",
      environment:
        process.env.NODE_ENV ??
        "development",
      capabilities: {
        persistentDatabaseAuditLedger: true,
        cryptographicHashChain: true,
        persistentPolicyRegistry: true,
        policyVersioning: true,
        safePolicyRollback: true,
        digitalAuditSignatures: true,
        digitalPolicySignatures: true,
        tamperDetection: true,
        integrityScanner: true,
        complianceSnapshots: true,
        signedComplianceReports: true,
        securityEvidenceVault: true,
        exportableAuditPackages: true,
        evidenceChecksums: true,
        evidenceDigitalSignatures: true,
        evidenceVerification: true,
      },
      signatureConfiguration:
        this.signatures
          .getConfiguration(),
      timestamp:
        new Date().toISOString(),
      uptimeSeconds: Number(
        process.uptime().toFixed(3),
      ),
    };
  }

  async getSnapshot() {
    const [
      auditSummary,
      auditIntegrity,
      policySummary,
      integritySummary,
      complianceCount,
      evidenceCount,
      latestCompliance,
      latestEvidence,
    ] = await Promise.all([
      this.audit.getSummary(),
      this.audit.verifyIntegrity(),
      this.policies.getSummary(),
      this.scanner.getSummary(),
      this.reports.countCompliance(),
      this.reports.countEvidence(),
      this.reports.findLatestCompliance(),
      this.reports.findLatestEvidence(),
    ]);

    return {
      success: true,
      system:
        "AVOS Enterprise Production",
      hardeningVersion: "v6",
      generatedAt:
        new Date().toISOString(),
      persistentAudit: {
        summary: auditSummary,
        integrity: auditIntegrity,
      },
      persistentGovernance: {
        policyVersioning:
          policySummary,
      },
      signedGovernance: {
        configuration:
          this.signatures
            .getConfiguration(),
        integrity:
          integritySummary,
      },
      complianceAndEvidence: {
        complianceSnapshots:
          complianceCount,
        evidencePackages:
          evidenceCount,
        latestCompliance:
          latestCompliance
            ? {
                id:
                  latestCompliance.id,
                status:
                  latestCompliance.status,
                reportType:
                  latestCompliance.reportType,
                generatedAt:
                  latestCompliance.generatedAt,
              }
            : null,
        latestEvidence:
          latestEvidence
            ? {
                id:
                  latestEvidence.id,
                status:
                  latestEvidence.status,
                packageType:
                  latestEvidence.packageType,
                generatedAt:
                  latestEvidence.generatedAt,
              }
            : null,
      },
    };
  }
}
