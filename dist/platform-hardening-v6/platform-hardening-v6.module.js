"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformHardeningV6Module = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const governance_integrity_controller_1 = require("./controllers/governance-integrity.controller");
const governance_reports_controller_1 = require("./controllers/governance-reports.controller");
const platform_hardening_v6_controller_1 = require("./controllers/platform-hardening-v6.controller");
const policy_versioning_controller_1 = require("./controllers/policy-versioning.controller");
const governance_compliance_report_service_1 = require("./services/governance-compliance-report.service");
const governance_evidence_vault_service_1 = require("./services/governance-evidence-vault.service");
const governance_integrity_repository_1 = require("./services/governance-integrity.repository");
const governance_integrity_scanner_service_1 = require("./services/governance-integrity-scanner.service");
const governance_record_hash_service_1 = require("./services/governance-record-hash.service");
const governance_record_verification_service_1 = require("./services/governance-record-verification.service");
const governance_report_repository_1 = require("./services/governance-report.repository");
const governance_signature_backfill_service_1 = require("./services/governance-signature-backfill.service");
const governance_signature_payload_service_1 = require("./services/governance-signature-payload.service");
const governance_signature_service_1 = require("./services/governance-signature.service");
const persistent_audit_ledger_service_1 = require("./services/persistent-audit-ledger.service");
const persistent_audit_repository_1 = require("./services/persistent-audit.repository");
const persistent_policy_seed_service_1 = require("./services/persistent-policy-seed.service");
const platform_hardening_v6_service_1 = require("./services/platform-hardening-v6.service");
const policy_checksum_service_1 = require("./services/policy-checksum.service");
const policy_version_repository_1 = require("./services/policy-version.repository");
const policy_versioning_service_1 = require("./services/policy-versioning.service");
const v5_audit_persistence_bridge_service_1 = require("./services/v5-audit-persistence-bridge.service");
const v6_diagnostics_token_guard_1 = require("./services/v6-diagnostics-token.guard");
let PlatformHardeningV6Module = class PlatformHardeningV6Module {
};
exports.PlatformHardeningV6Module = PlatformHardeningV6Module;
exports.PlatformHardeningV6Module = PlatformHardeningV6Module = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
        ],
        controllers: [
            platform_hardening_v6_controller_1.PlatformHardeningV6Controller,
            policy_versioning_controller_1.PolicyVersioningController,
            governance_integrity_controller_1.GovernanceIntegrityController,
            governance_reports_controller_1.GovernanceReportsController,
        ],
        providers: [
            persistent_audit_repository_1.PersistentAuditRepository,
            persistent_audit_ledger_service_1.PersistentAuditLedgerService,
            policy_checksum_service_1.PolicyChecksumService,
            policy_version_repository_1.PolicyVersionRepository,
            policy_versioning_service_1.PolicyVersioningService,
            persistent_policy_seed_service_1.PersistentPolicySeedService,
            governance_signature_service_1.GovernanceSignatureService,
            governance_signature_payload_service_1.GovernanceSignaturePayloadService,
            governance_integrity_repository_1.GovernanceIntegrityRepository,
            governance_signature_backfill_service_1.GovernanceSignatureBackfillService,
            governance_integrity_scanner_service_1.GovernanceIntegrityScannerService,
            governance_record_hash_service_1.GovernanceRecordHashService,
            governance_report_repository_1.GovernanceReportRepository,
            governance_compliance_report_service_1.GovernanceComplianceReportService,
            governance_evidence_vault_service_1.GovernanceEvidenceVaultService,
            governance_record_verification_service_1.GovernanceRecordVerificationService,
            platform_hardening_v6_service_1.PlatformHardeningV6Service,
            v5_audit_persistence_bridge_service_1.V5AuditPersistenceBridgeService,
            v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard,
        ],
        exports: [
            persistent_audit_repository_1.PersistentAuditRepository,
            persistent_audit_ledger_service_1.PersistentAuditLedgerService,
            policy_version_repository_1.PolicyVersionRepository,
            policy_versioning_service_1.PolicyVersioningService,
            governance_signature_service_1.GovernanceSignatureService,
            governance_integrity_scanner_service_1.GovernanceIntegrityScannerService,
            governance_compliance_report_service_1.GovernanceComplianceReportService,
            governance_evidence_vault_service_1.GovernanceEvidenceVaultService,
            governance_record_verification_service_1.GovernanceRecordVerificationService,
            platform_hardening_v6_service_1.PlatformHardeningV6Service,
        ],
    })
], PlatformHardeningV6Module);
//# sourceMappingURL=platform-hardening-v6.module.js.map