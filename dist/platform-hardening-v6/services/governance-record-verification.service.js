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
exports.GovernanceRecordVerificationService = void 0;
const common_1 = require("@nestjs/common");
const governance_record_hash_service_1 = require("./governance-record-hash.service");
const governance_report_repository_1 = require("./governance-report.repository");
const governance_signature_service_1 = require("./governance-signature.service");
let GovernanceRecordVerificationService = class GovernanceRecordVerificationService {
    constructor(repository, hashes, signatures) {
        this.repository = repository;
        this.hashes = hashes;
        this.signatures = signatures;
    }
    async verifyCompliance(id) {
        const record = await this.repository
            .findComplianceById(id);
        if (!record) {
            return this.missing(id, "compliance_snapshot");
        }
        const checksum = this.hashes.create(record.payload);
        const checksumValid = checksum === record.checksum;
        const signatureValid = this.signatures.verifyPayload({
            payload: {
                checksum: record.checksum,
                payload: record.payload,
            },
            signature: record.signature,
            signedAt: record.signedAt,
            algorithm: record.signatureAlgorithm,
            keyId: record.signatureKeyId,
        });
        return {
            valid: checksumValid &&
                signatureValid,
            checksumValid,
            signatureValid,
            recordId: id,
            recordType: "compliance_snapshot",
            checkedAt: new Date().toISOString(),
        };
    }
    async verifyEvidence(id) {
        const record = await this.repository
            .findEvidenceById(id);
        if (!record) {
            return this.missing(id, "evidence_package");
        }
        const checksum = this.hashes.create(record.payload);
        const checksumValid = checksum === record.checksum;
        const signatureValid = this.signatures.verifyPayload({
            payload: {
                checksum: record.checksum,
                payload: record.payload,
            },
            signature: record.signature,
            signedAt: record.signedAt,
            algorithm: record.signatureAlgorithm,
            keyId: record.signatureKeyId,
        });
        return {
            valid: checksumValid &&
                signatureValid,
            checksumValid,
            signatureValid,
            recordId: id,
            recordType: "evidence_package",
            checkedAt: new Date().toISOString(),
        };
    }
    missing(id, type) {
        return {
            valid: false,
            checksumValid: false,
            signatureValid: false,
            recordId: id,
            recordType: type,
            checkedAt: new Date().toISOString(),
        };
    }
};
exports.GovernanceRecordVerificationService = GovernanceRecordVerificationService;
exports.GovernanceRecordVerificationService = GovernanceRecordVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [governance_report_repository_1.GovernanceReportRepository,
        governance_record_hash_service_1.GovernanceRecordHashService,
        governance_signature_service_1.GovernanceSignatureService])
], GovernanceRecordVerificationService);
//# sourceMappingURL=governance-record-verification.service.js.map