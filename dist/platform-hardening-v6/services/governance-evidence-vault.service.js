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
exports.GovernanceEvidenceVaultService = void 0;
const common_1 = require("@nestjs/common");
const governance_integrity_scanner_service_1 = require("./governance-integrity-scanner.service");
const governance_record_hash_service_1 = require("./governance-record-hash.service");
const governance_report_repository_1 = require("./governance-report.repository");
const governance_signature_service_1 = require("./governance-signature.service");
const persistent_audit_ledger_service_1 = require("./persistent-audit-ledger.service");
const policy_versioning_service_1 = require("./policy-versioning.service");
let GovernanceEvidenceVaultService = class GovernanceEvidenceVaultService {
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
        const packageType = input?.packageType ??
            "full_governance";
        const evidence = [];
        if (packageType ===
            "full_governance" ||
            packageType ===
                "audit_evidence") {
            evidence.push({
                type: "audit_summary",
                source: "persistent-audit-ledger",
                data: await this.audit.getSummary(),
            });
            evidence.push({
                type: "audit_integrity",
                source: "persistent-audit-ledger",
                data: await this.audit
                    .verifyIntegrity(),
            });
            evidence.push({
                type: "recent_audit_events",
                source: "persistent-audit-ledger",
                data: await this.audit.findMany({
                    limit: 250,
                }),
            });
        }
        if (packageType ===
            "full_governance" ||
            packageType ===
                "policy_evidence") {
            evidence.push({
                type: "policy_summary",
                source: "persistent-policy-registry",
                data: await this.policies.getSummary(),
            });
            evidence.push({
                type: "policies",
                source: "persistent-policy-registry",
                data: await this.policies.findAll(),
            });
        }
        if (packageType ===
            "full_governance" ||
            packageType ===
                "integrity_evidence") {
            evidence.push({
                type: "integrity_summary",
                source: "governance-integrity-scanner",
                data: await this.scanner.getSummary(),
            });
            evidence.push({
                type: "integrity_history",
                source: "governance-integrity-scanner",
                data: await this.scanner.getHistory(100),
            });
        }
        const payload = {
            packageType,
            title: "AVOS Security and Governance Evidence Package",
            scope: packageType,
            generatedAt: generatedAt.toISOString(),
            evidence,
            metadata: {
                system: "AVOS Enterprise Production",
                hardeningVersion: "v6",
                formatVersion: "1.0",
            },
        };
        const checksum = this.hashes.create(payload);
        const signature = this.signatures.signPayload({
            checksum,
            payload,
        });
        const status = this.determineStatus(evidence);
        const created = await this.repository
            .createEvidence({
            packageType,
            status,
            title: payload.title,
            description: input?.description,
            scope: packageType,
            evidenceCount: evidence.length,
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
            eventType: "security_evidence",
            severity: "info",
            action: "governance-evidence-package-created",
            message: `Governance evidence package ${created.id} was generated`,
            actor: input?.generatedBy ??
                "platform-owner",
            correlationId: input?.correlationId,
            traceId: input?.traceId,
            metadata: {
                packageId: created.id,
                packageType,
                evidenceCount: evidence.length,
                checksum,
            },
        });
        return created;
    }
    findAll(limit = 100) {
        return this.repository
            .findEvidencePackages(limit);
    }
    async findOne(id) {
        const item = await this.repository
            .findEvidenceById(id);
        if (!item) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Evidence package ${id} was not found`,
            });
        }
        return item;
    }
    latest() {
        return this.repository
            .findLatestEvidence();
    }
    determineStatus(evidence) {
        const serialized = JSON.stringify(evidence);
        if (serialized.includes('"status":"compromised"') ||
            serialized.includes('"valid":false')) {
            return "compromised";
        }
        if (serialized.includes('"status":"warning"')) {
            return "attention_required";
        }
        return "verified";
    }
};
exports.GovernanceEvidenceVaultService = GovernanceEvidenceVaultService;
exports.GovernanceEvidenceVaultService = GovernanceEvidenceVaultService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [persistent_audit_ledger_service_1.PersistentAuditLedgerService,
        policy_versioning_service_1.PolicyVersioningService,
        governance_integrity_scanner_service_1.GovernanceIntegrityScannerService,
        governance_report_repository_1.GovernanceReportRepository,
        governance_record_hash_service_1.GovernanceRecordHashService,
        governance_signature_service_1.GovernanceSignatureService])
], GovernanceEvidenceVaultService);
//# sourceMappingURL=governance-evidence-vault.service.js.map