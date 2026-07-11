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
exports.GovernanceIntegrityScannerService = void 0;
const common_1 = require("@nestjs/common");
const persistent_audit_hash_util_1 = require("../utils/persistent-audit-hash.util");
const policy_checksum_service_1 = require("./policy-checksum.service");
const governance_integrity_repository_1 = require("./governance-integrity.repository");
const governance_signature_payload_service_1 = require("./governance-signature-payload.service");
const governance_signature_service_1 = require("./governance-signature.service");
let GovernanceIntegrityScannerService = class GovernanceIntegrityScannerService {
    constructor(repository, signatures, payloads, checksums) {
        this.repository = repository;
        this.signatures = signatures;
        this.payloads = payloads;
        this.checksums = checksums;
    }
    async run(input) {
        const startedAt = new Date();
        const scope = input?.scope ?? "all";
        const result = {
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
            startedAt: startedAt.toISOString(),
            completedAt: "",
        };
        if (scope === "all" ||
            scope === "audit") {
            await this.scanAudit(result);
        }
        if (scope === "all" ||
            scope === "policies") {
            await this.scanPolicies(result);
        }
        if (result.compromised) {
            result.status = "compromised";
        }
        else if (result.audit.unsignedRecords > 0 ||
            result.policies.unsignedRecords > 0) {
            result.status = "warning";
        }
        const completedAt = new Date();
        result.completedAt =
            completedAt.toISOString();
        await this.repository.createScan({
            status: result.status,
            scope,
            auditTotal: result.audit.total,
            auditVerified: result.audit.verified,
            auditHashValid: result.audit.hashChainValid,
            auditSignaturesValid: result.audit.signaturesValid,
            policyTotal: result.policies.total,
            policyVerified: result.policies.verified,
            policyChecksumsValid: result.policies.checksumsValid,
            policySignaturesValid: result.policies.signaturesValid,
            unsignedAuditRecords: result.audit.unsignedRecords,
            unsignedPolicyRecords: result.policies.unsignedRecords,
            compromisedRecordType: result.compromised
                ?.recordType,
            compromisedRecordId: result.compromised
                ?.recordId,
            compromisedSequence: result.compromised
                ?.sequence,
            details: result,
            executedBy: input?.executedBy ??
                "platform-owner",
            correlationId: input?.correlationId,
            traceId: input?.traceId,
            startedAt,
            completedAt,
        });
        return result;
    }
    async getSummary() {
        const latest = await this.repository
            .findLatestScan();
        return {
            latestScan: latest,
            signatureConfiguration: this.signatures
                .getConfiguration(),
        };
    }
    getHistory(limit = 100) {
        return this.repository
            .findScans(limit);
    }
    async scanAudit(result) {
        const records = await this.repository
            .findAuditAscending();
        result.audit.total =
            records.length;
        let previousHash = "GENESIS";
        for (const record of records) {
            if (!record.signature ||
                !record.signedAt ||
                !record.signatureKeyId ||
                !record.signatureAlgorithm) {
                result.audit
                    .unsignedRecords += 1;
                result.audit
                    .signaturesValid = false;
            }
            const expectedHash = persistent_audit_hash_util_1.PersistentAuditHashUtil.create({
                sequence: record.sequence,
                eventType: record.eventType,
                severity: record.severity,
                action: record.action,
                message: record.message,
                actor: record.actor,
                correlationId: record.correlationId,
                traceId: record.traceId,
                method: record.method,
                path: record.path,
                statusCode: record.statusCode,
                metadata: record.metadata,
                previousHash,
                createdAt: record.createdAt,
            });
            if (record.previousHash !==
                previousHash ||
                record.hash !==
                    expectedHash) {
                result.audit
                    .hashChainValid = false;
                result.compromised = {
                    recordType: "audit",
                    recordId: record.id,
                    sequence: record.sequence,
                    reason: "Audit hash chain verification failed",
                };
                return;
            }
            if (record.signature &&
                record.signedAt) {
                const validSignature = this.signatures.verifyPayload({
                    payload: this.payloads.audit(record),
                    signature: record.signature,
                    signedAt: record.signedAt,
                    algorithm: record.signatureAlgorithm,
                    keyId: record.signatureKeyId,
                });
                if (!validSignature) {
                    result.audit
                        .signaturesValid = false;
                    result.compromised = {
                        recordType: "audit",
                        recordId: record.id,
                        sequence: record.sequence,
                        reason: "Audit digital signature verification failed",
                    };
                    return;
                }
            }
            previousHash =
                record.hash;
            result.audit.verified += 1;
        }
    }
    async scanPolicies(result) {
        const versions = await this.repository
            .findPolicyVersionsAscending();
        result.policies.total =
            versions.length;
        for (const version of versions) {
            if (!version.policySignature ||
                !version.signedAt ||
                !version.signatureKeyId ||
                !version.signatureAlgorithm) {
                result.policies
                    .unsignedRecords += 1;
                result.policies
                    .signaturesValid = false;
            }
            const checksum = this.checksums.create({
                id: version.policyId,
                name: version.name,
                description: version.description,
                enabled: version.enabled,
                methods: this.toStringArray(version.methods),
                pathPrefixes: this.toStringArray(version.pathPrefixes),
                requireApprovalToken: version.requireApprovalToken,
                blockInProduction: version.blockInProduction,
                severity: version.severity,
            });
            if (checksum !==
                version.checksum) {
                result.policies
                    .checksumsValid = false;
                result.compromised = {
                    recordType: "policy",
                    recordId: version.id,
                    reason: `Policy checksum verification failed for ${version.policyId} version ${version.version}`,
                };
                return;
            }
            if (version.policySignature &&
                version.signedAt) {
                const validSignature = this.signatures.verifyPayload({
                    payload: this.payloads.policy(version),
                    signature: version.policySignature,
                    signedAt: version.signedAt,
                    algorithm: version.signatureAlgorithm,
                    keyId: version.signatureKeyId,
                });
                if (!validSignature) {
                    result.policies
                        .signaturesValid = false;
                    result.compromised = {
                        recordType: "policy",
                        recordId: version.id,
                        reason: `Policy digital signature verification failed for ${version.policyId} version ${version.version}`,
                    };
                    return;
                }
            }
            result.policies.verified += 1;
        }
    }
    toStringArray(value) {
        return Array.isArray(value)
            ? value.map(String)
            : [];
    }
};
exports.GovernanceIntegrityScannerService = GovernanceIntegrityScannerService;
exports.GovernanceIntegrityScannerService = GovernanceIntegrityScannerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [governance_integrity_repository_1.GovernanceIntegrityRepository,
        governance_signature_service_1.GovernanceSignatureService,
        governance_signature_payload_service_1.GovernanceSignaturePayloadService,
        policy_checksum_service_1.PolicyChecksumService])
], GovernanceIntegrityScannerService);
//# sourceMappingURL=governance-integrity-scanner.service.js.map