import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { GovernanceIntegrityController } from "./controllers/governance-integrity.controller";
import { GovernanceReportsController } from "./controllers/governance-reports.controller";
import { PlatformHardeningV6Controller } from "./controllers/platform-hardening-v6.controller";
import { PolicyVersioningController } from "./controllers/policy-versioning.controller";
import { GovernanceComplianceReportService } from "./services/governance-compliance-report.service";
import { GovernanceEvidenceVaultService } from "./services/governance-evidence-vault.service";
import { GovernanceIntegrityRepository } from "./services/governance-integrity.repository";
import { GovernanceIntegrityScannerService } from "./services/governance-integrity-scanner.service";
import { GovernanceRecordHashService } from "./services/governance-record-hash.service";
import { GovernanceRecordVerificationService } from "./services/governance-record-verification.service";
import { GovernanceReportRepository } from "./services/governance-report.repository";
import { GovernanceSignatureBackfillService } from "./services/governance-signature-backfill.service";
import { GovernanceSignaturePayloadService } from "./services/governance-signature-payload.service";
import { GovernanceSignatureService } from "./services/governance-signature.service";
import { PersistentAuditLedgerService } from "./services/persistent-audit-ledger.service";
import { PersistentAuditRepository } from "./services/persistent-audit.repository";
import { PersistentPolicySeedService } from "./services/persistent-policy-seed.service";
import { PlatformHardeningV6Service } from "./services/platform-hardening-v6.service";
import { PolicyChecksumService } from "./services/policy-checksum.service";
import { PolicyVersionRepository } from "./services/policy-version.repository";
import { PolicyVersioningService } from "./services/policy-versioning.service";
import { V5AuditPersistenceBridgeService } from "./services/v5-audit-persistence-bridge.service";
import { V6DiagnosticsTokenGuard } from "./services/v6-diagnostics-token.guard";

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    PlatformHardeningV6Controller,
    PolicyVersioningController,
    GovernanceIntegrityController,
    GovernanceReportsController,
  ],
  providers: [
    PersistentAuditRepository,
    PersistentAuditLedgerService,
    PolicyChecksumService,
    PolicyVersionRepository,
    PolicyVersioningService,
    PersistentPolicySeedService,
    GovernanceSignatureService,
    GovernanceSignaturePayloadService,
    GovernanceIntegrityRepository,
    GovernanceSignatureBackfillService,
    GovernanceIntegrityScannerService,
    GovernanceRecordHashService,
    GovernanceReportRepository,
    GovernanceComplianceReportService,
    GovernanceEvidenceVaultService,
    GovernanceRecordVerificationService,
    PlatformHardeningV6Service,
    V5AuditPersistenceBridgeService,
    V6DiagnosticsTokenGuard,
  ],
  exports: [
    PersistentAuditRepository,
    PersistentAuditLedgerService,
    PolicyVersionRepository,
    PolicyVersioningService,
    GovernanceSignatureService,
    GovernanceIntegrityScannerService,
    GovernanceComplianceReportService,
    GovernanceEvidenceVaultService,
    GovernanceRecordVerificationService,
    PlatformHardeningV6Service,
  ],
})
export class PlatformHardeningV6Module {}
