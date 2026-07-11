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
exports.GovernanceComplianceReportService = void 0;
const common_1 = require("@nestjs/common");
const governance_integrity_scanner_service_1 = require("./governance-integrity-scanner.service");
const governance_record_hash_service_1 = require("./governance-record-hash.service");
const governance_report_repository_1 = require("./governance-report.repository");
const governance_signature_service_1 = require("./governance-signature.service");
const persistent_audit_ledger_service_1 = require("./persistent-audit-ledger.service");
const policy_versioning_service_1 = require("./policy-versioning.service");
let GovernanceComplianceReportService = class GovernanceComplianceReportService {
    constructor(audit, policies, scanner, repository, hashes, signatures) {
        this.audit = audit;
        this.policies = policies;
        this.scanner = scanner;
        this.repository = repository;
        this.hashes = hashes;
        this.signatures = signatures;
    }
    async generate(input) {
        const generatedAt = new Date();
        const reportType = input?.reportType ?? "full";
        const [auditSummary, auditIntegrity, policySummary, integritySummary,] = await Promise.all([
            this.audit.getSummary(),
            this.audit.verifyIntegrity(),
            this.policies.getSummary(),
            this.scanner.getSummary(),
        ]);
        const latestScan = integritySummary.latestScan;
        const findings = [
            {
                id: "audit-chain-integrity",
                category: "audit",
                severity: auditIntegrity.valid
                    ? "info"
                    : "critical",
                title: "Persistent audit hash chain",
                description: auditIntegrity.valid
                    ? "The persistent audit hash chain is valid."
                    : "The persistent audit hash chain failed integrity verification.",
                compliant: auditIntegrity.valid,
                evidence: {
                    totalEvents: auditIntegrity.totalEvents,
                    verifiedEvents: auditIntegrity.verifiedEvents,
                },
            },
            {
                id: "policy-versioning",
                category: "governance",
                severity: policySummary.totalPolicies > 0
                    ? "info"
                    : "warning",
                title: "Persistent policy registry",
                description: policySummary.totalPolicies > 0
                    ? "Persistent policy versioning is operational."
                    : "No persistent runtime policies were found.",
                compliant: policySummary.totalPolicies > 0,
                evidence: {
                    ...policySummary,
                },
            },
            {
                id: "audit-signatures",
                category: "signatures",
                severity: latestScan?.auditSignaturesValid
                    ? "info"
                    : "error",
                title: "Audit digital signatures",
                description: latestScan?.auditSignaturesValid
                    ? "All scanned audit signatures are valid."
                    : "Audit signatures require attention or no scan is available.",
                compliant: Boolean(latestScan?.auditSignaturesValid),
                evidence: {
                    latestScanId: latestScan?.id ?? null,
                    unsignedRecords: latestScan?.unsignedAuditRecords ??
                        null,
                },
            },
            {
                id: "policy-signatures",
                category: "signatures",
                severity: latestScan?.policySignaturesValid
                    ? "info"
                    : "error",
                title: "Policy digital signatures",
                description: latestScan?.policySignaturesValid
                    ? "All scanned policy signatures are valid."
                    : "Policy signatures require attention or no scan is available.",
                compliant: Boolean(latestScan?.policySignaturesValid),
                evidence: {
                    latestScanId: latestScan?.id ?? null,
                    unsignedRecords: latestScan?.unsignedPolicyRecords ??
                        null,
                },
            },
            {
                id: "policy-checksums",
                category: "governance",
                severity: latestScan?.policyChecksumsValid
                    ? "info"
                    : "critical",
                title: "Policy checksum integrity",
                description: latestScan?.policyChecksumsValid
                    ? "All scanned policy checksums are valid."
                    : "Policy checksum validation requires attention.",
                compliant: Boolean(latestScan?.policyChecksumsValid),
                evidence: {
                    latestScanId: latestScan?.id ?? null,
                },
            },
        ];
        const compliantChecks = findings.filter((item) => item.compliant).length;
        const warningChecks = findings.filter((item) => !item.compliant &&
            item.severity === "warning").length;
        const failedChecks = findings.filter((item) => !item.compliant &&
            (item.severity === "error" ||
                item.severity === "critical")).length;
        const compromised = latestScan?.status ===
            "compromised" ||
            !auditIntegrity.valid;
        const status = compromised
            ? "compromised"
            : failedChecks > 0 ||
                warningChecks > 0
                ? "attention_required"
                : "compliant";
        const recommendations = this.buildRecommendations(findings);
        const payload = {
            reportType,
            status,
            title: "AVOS Governance Compliance Snapshot",
            generatedAt: generatedAt.toISOString(),
            summary: {
                compliantChecks,
                warningChecks,
                failedChecks,
                totalChecks: findings.length,
            },
            findings,
            recommendations,
            metrics: {
                audit: auditSummary,
                policies: policySummary,
                integrity: latestScan
                    ? {
                        status: latestScan.status,
                        scanId: latestScan.id,
                        completedAt: latestScan.completedAt,
                    }
                    : null,
            },
        };
        const checksum = this.hashes.create(payload);
        const signature = this.signatures.signPayload({
            checksum,
            payload,
        });
        const created = await this.repository
            .createCompliance({
            reportType,
            status,
            title: payload.title,
            summary: payload.summary,
            findings: payload.findings,
            recommendations: payload.recommendations,
            metrics: payload.metrics,
            payload: payload,
            checksum,
            signature: signature.signature,
            signatureAlgorithm: signature.algorithm,
            signatureKeyId: signature.keyId,
            generatedBy: input?.generatedBy ??
                "platform-owner",
            correlationId: input?.correlationId,
            traceId: input?.traceId,
            generatedAt,
            signedAt: new Date(signature.signedAt),
        });
        await this.audit.append({
            eventType: "compliance_report",
            severity: status === "compliant"
                ? "info"
                : status ===
                    "attention_required"
                    ? "warning"
                    : "critical",
            action: "governance-compliance-snapshot-created",
            message: `Governance compliance snapshot ${created.id} was generated with status ${status}`,
            actor: input?.generatedBy ??
                "platform-owner",
            correlationId: input?.correlationId,
            traceId: input?.traceId,
            metadata: {
                snapshotId: created.id,
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
    async findOne(id) {
        const item = await this.repository
            .findComplianceById(id);
        if (!item) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Compliance snapshot ${id} was not found`,
            });
        }
        return item;
    }
    latest() {
        return this.repository
            .findLatestCompliance();
    }
    buildRecommendations(findings) {
        const recommendations = [];
        for (const finding of findings) {
            if (finding.compliant) {
                continue;
            }
            switch (finding.id) {
                case "audit-chain-integrity":
                    recommendations.push("Immediately investigate the persistent audit hash chain and suspend sensitive governance changes.");
                    break;
                case "audit-signatures":
                    recommendations.push("Run governance signature backfill and a full integrity scan.");
                    break;
                case "policy-signatures":
                    recommendations.push("Sign all unsigned policy versions and verify the configured signing key.");
                    break;
                case "policy-checksums":
                    recommendations.push("Review the affected policy versions for unauthorized modification.");
                    break;
                case "policy-versioning":
                    recommendations.push("Initialize the persistent runtime policy registry.");
                    break;
            }
        }
        if (recommendations.length === 0) {
            recommendations.push("No immediate remediation is required. Continue scheduled integrity scans.");
        }
        return recommendations;
    }
};
exports.GovernanceComplianceReportService = GovernanceComplianceReportService;
exports.GovernanceComplianceReportService = GovernanceComplianceReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [persistent_audit_ledger_service_1.PersistentAuditLedgerService,
        policy_versioning_service_1.PolicyVersioningService,
        governance_integrity_scanner_service_1.GovernanceIntegrityScannerService,
        governance_report_repository_1.GovernanceReportRepository,
        governance_record_hash_service_1.GovernanceRecordHashService,
        governance_signature_service_1.GovernanceSignatureService])
], GovernanceComplianceReportService);
//# sourceMappingURL=governance-compliance-report.service.js.map