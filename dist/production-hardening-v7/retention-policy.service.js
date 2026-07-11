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
exports.RetentionPolicyService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const assurance_storage_service_1 = require("./assurance-storage.service");
let RetentionPolicyService = class RetentionPolicyService {
    constructor(storage) {
        this.storage = storage;
        this.collection = "retention-policies";
    }
    async create(dto) {
        const policies = await this.storage.readCollection(this.collection);
        const duplicate = policies.find((policy) => policy.policyCode === dto.policyCode);
        if (duplicate) {
            throw new Error(`Retention policy ${dto.policyCode} already exists`);
        }
        this.validateRetentionSequence(dto);
        const now = new Date().toISOString();
        const policy = {
            id: (0, node_crypto_1.randomUUID)(),
            policyCode: dto.policyCode,
            resourceType: dto.resourceType,
            retentionDays: dto.retentionDays,
            archiveAfterDays: dto.archiveAfterDays,
            purgeAfterDays: dto.purgeAfterDays,
            legalHoldSupported: dto.legalHoldSupported ?? true,
            enabled: dto.enabled ?? true,
            description: dto.description,
            createdAt: now,
            updatedAt: now,
        };
        policies.push(policy);
        await this.storage.writeCollection(this.collection, policies);
        return policy;
    }
    async list() {
        const policies = await this.storage.readCollection(this.collection);
        return policies.sort((a, b) => a.policyCode.localeCompare(b.policyCode));
    }
    async seedDefaults() {
        const existing = await this.list();
        const defaults = [
            {
                policyCode: "AVOS-RET-AUDIT-001",
                resourceType: "persistent-audit-ledger",
                retentionDays: 2555,
                archiveAfterDays: 365,
                purgeAfterDays: 2920,
                legalHoldSupported: true,
                enabled: true,
                description: "Seven-year online retention for enterprise audit evidence, followed by controlled purge eligibility.",
            },
            {
                policyCode: "AVOS-RET-EVIDENCE-001",
                resourceType: "security-evidence-package",
                retentionDays: 2555,
                archiveAfterDays: 730,
                purgeAfterDays: 3650,
                legalHoldSupported: true,
                enabled: true,
                description: "Long-term evidence-vault lifecycle with archive and legal-hold support.",
            },
            {
                policyCode: "AVOS-RET-COMPLIANCE-001",
                resourceType: "compliance-snapshot",
                retentionDays: 1825,
                archiveAfterDays: 365,
                purgeAfterDays: 2190,
                legalHoldSupported: true,
                enabled: true,
                description: "Five-year online retention for compliance snapshots.",
            },
            {
                policyCode: "AVOS-RET-ASSURANCE-001",
                resourceType: "continuous-assurance-report",
                retentionDays: 1095,
                archiveAfterDays: 365,
                purgeAfterDays: 1460,
                legalHoldSupported: true,
                enabled: true,
                description: "Three-year retention for continuous assurance reports.",
            },
        ];
        let created = 0;
        for (const dto of defaults) {
            if (existing.some((policy) => policy.policyCode === dto.policyCode)) {
                continue;
            }
            this.validateRetentionSequence(dto);
            const now = new Date().toISOString();
            existing.push({
                id: (0, node_crypto_1.randomUUID)(),
                policyCode: dto.policyCode,
                resourceType: dto.resourceType,
                retentionDays: dto.retentionDays,
                archiveAfterDays: dto.archiveAfterDays,
                purgeAfterDays: dto.purgeAfterDays,
                legalHoldSupported: dto.legalHoldSupported ?? true,
                enabled: dto.enabled ?? true,
                description: dto.description,
                createdAt: now,
                updatedAt: now,
            });
            created += 1;
        }
        await this.storage.writeCollection(this.collection, existing);
        return {
            created,
            total: existing.length,
        };
    }
    validateRetentionSequence(dto) {
        if (dto.archiveAfterDays !== undefined &&
            dto.archiveAfterDays > dto.retentionDays) {
            throw new Error("archiveAfterDays cannot exceed retentionDays");
        }
        if (dto.purgeAfterDays !== undefined &&
            dto.purgeAfterDays < dto.retentionDays) {
            throw new Error("purgeAfterDays cannot be less than retentionDays");
        }
    }
};
exports.RetentionPolicyService = RetentionPolicyService;
exports.RetentionPolicyService = RetentionPolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [assurance_storage_service_1.AssuranceStorageService])
], RetentionPolicyService);
//# sourceMappingURL=retention-policy.service.js.map