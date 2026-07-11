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
exports.GovernanceSignatureBackfillService = void 0;
const common_1 = require("@nestjs/common");
const governance_integrity_repository_1 = require("./governance-integrity.repository");
const governance_signature_payload_service_1 = require("./governance-signature-payload.service");
const governance_signature_service_1 = require("./governance-signature.service");
let GovernanceSignatureBackfillService = class GovernanceSignatureBackfillService {
    constructor(repository, payloads, signatures) {
        this.repository = repository;
        this.payloads = payloads;
        this.signatures = signatures;
    }
    async onModuleInit() {
        await this.backfillAll();
    }
    async backfillAll() {
        const auditCount = await this.backfillAudit();
        const policyCount = await this.backfillPolicies();
        return {
            auditRecordsSigned: auditCount,
            policyVersionsSigned: policyCount,
            completedAt: new Date().toISOString(),
        };
    }
    async backfillAudit() {
        let total = 0;
        while (true) {
            const records = await this.repository
                .findUnsignedAudit(500);
            if (records.length === 0) {
                break;
            }
            for (const record of records) {
                const signature = this.signatures.signPayload(this.payloads.audit(record));
                await this.repository
                    .updateAuditSignature(record.id, {
                    signature: signature.signature,
                    signatureAlgorithm: signature.algorithm,
                    signatureKeyId: signature.keyId,
                    signedAt: new Date(signature.signedAt),
                });
                total += 1;
            }
        }
        return total;
    }
    async backfillPolicies() {
        let total = 0;
        while (true) {
            const records = await this.repository
                .findUnsignedPolicyVersions(500);
            if (records.length === 0) {
                break;
            }
            for (const record of records) {
                const signature = this.signatures.signPayload(this.payloads.policy(record));
                await this.repository
                    .updatePolicySignature(record.id, {
                    policySignature: signature.signature,
                    signatureAlgorithm: signature.algorithm,
                    signatureKeyId: signature.keyId,
                    signedAt: new Date(signature.signedAt),
                });
                total += 1;
            }
        }
        return total;
    }
};
exports.GovernanceSignatureBackfillService = GovernanceSignatureBackfillService;
exports.GovernanceSignatureBackfillService = GovernanceSignatureBackfillService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [governance_integrity_repository_1.GovernanceIntegrityRepository,
        governance_signature_payload_service_1.GovernanceSignaturePayloadService,
        governance_signature_service_1.GovernanceSignatureService])
], GovernanceSignatureBackfillService);
//# sourceMappingURL=governance-signature-backfill.service.js.map