"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformHardeningV6Service = void 0;
const common_1 = require("@nestjs/common");
const governance_integrity_scanner_service_1 = require("./governance-integrity-scanner.service");
const governance_report_repository_1 = require("./governance-report.repository");
const governance_signature_service_1 = require("./governance-signature.service");
const persistent_audit_ledger_service_1 = require("./persistent-audit-ledger.service");
const policy_versioning_service_1 = require("./policy-versioning.service");
let PlatformHardeningV6Service = class PlatformHardeningV6Service {
    constructor(audit, policies, scanner, signatures, reports) {
        this.audit = audit;
        this.policies = policies;
        this.scanner = scanner;
        this.signatures = signatures;
        this.reports = reports;
    }
    getStatus() {
        return {
            success: true,
            system: "AVOS Platform Hardening",
            version: "v6",
            phase: "persistent-signed-governance-compliance-and-evidence-vault",
            environment: process.env.NODE_ENV ??
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
            signatureConfiguration: this.signatures
                .getConfiguration(),
            timestamp: new Date().toISOString(),
            uptimeSeconds: Number(process.uptime().toFixed(3)),
        };
    }
    async getSnapshot() {
        const [auditSummary, auditIntegrity, policySummary, integritySummary, complianceCount, evidenceCount, latestCompliance, latestEvidence,] = await Promise.all([
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
            system: "AVOS Enterprise Production",
            hardeningVersion: "v6",
            generatedAt: new Date().toISOString(),
            persistentAudit: {
                summary: auditSummary,
                integrity: auditIntegrity,
            },
            persistentGovernance: {
                policyVersioning: policySummary,
            },
            signedGovernance: {
                configuration: this.signatures
                    .getConfiguration(),
                integrity: integritySummary,
            },
            complianceAndEvidence: {
                complianceSnapshots: complianceCount,
                evidencePackages: evidenceCount,
                latestCompliance: latestCompliance
                    ? {
                        id: latestCompliance.id,
                        status: latestCompliance.status,
                        reportType: latestCompliance.reportType,
                        generatedAt: latestCompliance.generatedAt,
                    }
                    : null,
                latestEvidence: latestEvidence
                    ? {
                        id: latestEvidence.id,
                        status: latestEvidence.status,
                        packageType: latestEvidence.packageType,
                        generatedAt: latestEvidence.generatedAt,
                    }
                    : null,
            },
        };
    }
};
exports.PlatformHardeningV6Service = PlatformHardeningV6Service;
exports.PlatformHardeningV6Service = PlatformHardeningV6Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [persistent_audit_ledger_service_1.PersistentAuditLedgerService,
        policy_versioning_service_1.PolicyVersioningService,
        governance_integrity_scanner_service_1.GovernanceIntegrityScannerService,
        governance_signature_service_1.GovernanceSignatureService,
        governance_report_repository_1.GovernanceReportRepository])
], PlatformHardeningV6Service);
//# sourceMappingURL=platform-hardening-v6.service.js.map