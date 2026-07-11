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
exports.RuntimeGovernanceRetentionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
let RuntimeGovernanceRetentionService = class RuntimeGovernanceRetentionService {
    constructor(store) {
        this.store = store;
    }
    create(dto) {
        const duplicate = this.store
            .listGovernanceRetentionPolicies()
            .find((policy) => policy.key === dto.key &&
            policy.status !==
                contracts_1.GovernanceRetentionStatus.ARCHIVED);
        if (duplicate) {
            throw new common_1.BadRequestException(`Retention policy already exists for key ${dto.key}`);
        }
        const now = new Date().toISOString();
        const policy = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            status: contracts_1.GovernanceRetentionStatus.ACTIVE,
            archiveTypes: dto.archiveTypes,
            classifications: dto.classifications,
            retentionDays: dto.retentionDays,
            archiveAfterDays: dto.archiveAfterDays,
            compressAfterDays: dto.compressAfterDays,
            redactAfterDays: dto.redactAfterDays,
            deleteAfterDays: dto.deleteAfterDays,
            legalHold: dto.legalHold,
            immutable: dto.immutable,
            environment: dto.environment,
            namespace: dto.namespace,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
            activatedAt: now,
        };
        return this.store
            .saveGovernanceRetentionPolicy(policy);
    }
    evaluate(input) {
        const policy = this.get(input.policyId);
        if (policy.status !==
            contracts_1.GovernanceRetentionStatus.ACTIVE) {
            throw new common_1.BadRequestException("Retention policy is not active");
        }
        const ageMilliseconds = Date.now() -
            new Date(input.resourceCreatedAt).getTime();
        const resourceAgeDays = Math.max(0, Math.floor(ageMilliseconds /
            86400000));
        let action = contracts_1.GovernanceRetentionAction.RETAIN;
        let reason = "Resource remains within retention period";
        if (policy.legalHold) {
            action =
                contracts_1.GovernanceRetentionAction.LEGAL_HOLD;
            reason =
                "Retention policy has legal hold enabled";
        }
        else if (policy.deleteAfterDays !==
            undefined &&
            resourceAgeDays >=
                policy.deleteAfterDays) {
            action =
                contracts_1.GovernanceRetentionAction.DELETE;
            reason =
                "Resource reached deletion age";
        }
        else if (policy.redactAfterDays !==
            undefined &&
            resourceAgeDays >=
                policy.redactAfterDays) {
            action =
                contracts_1.GovernanceRetentionAction.REDACT;
            reason =
                "Resource reached redaction age";
        }
        else if (policy.compressAfterDays !==
            undefined &&
            resourceAgeDays >=
                policy.compressAfterDays) {
            action =
                contracts_1.GovernanceRetentionAction.COMPRESS;
            reason =
                "Resource reached compression age";
        }
        else if (policy.archiveAfterDays !==
            undefined &&
            resourceAgeDays >=
                policy.archiveAfterDays) {
            action =
                contracts_1.GovernanceRetentionAction.ARCHIVE;
            reason =
                "Resource reached archive age";
        }
        const evaluation = {
            id: (0, crypto_1.randomUUID)(),
            policyId: policy.id,
            resourceType: input.resourceType,
            resourceId: input.resourceId,
            resourceCreatedAt: input.resourceCreatedAt,
            resourceAgeDays,
            classification: input.classification,
            action,
            reason,
            evaluatedAt: new Date().toISOString(),
        };
        return this.store
            .saveGovernanceRetentionEvaluation(evaluation);
    }
    updateStatus(id, dto) {
        const policy = this.get(id);
        const now = new Date().toISOString();
        policy.status =
            dto.status;
        policy.updatedAt =
            now;
        if (dto.status ===
            contracts_1.GovernanceRetentionStatus.ACTIVE) {
            policy.activatedAt =
                now;
        }
        if (dto.status ===
            contracts_1.GovernanceRetentionStatus.DISABLED) {
            policy.disabledAt =
                now;
        }
        if (dto.status ===
            contracts_1.GovernanceRetentionStatus.ARCHIVED) {
            policy.archivedAt =
                now;
        }
        policy.metadata = {
            ...policy.metadata,
            lastStatusReason: dto.reason,
            lastStatusActorId: dto.actor.id,
        };
        return this.store
            .saveGovernanceRetentionPolicy(policy);
    }
    list() {
        return this.store
            .listGovernanceRetentionPolicies();
    }
    listEvaluations() {
        return this.store
            .listGovernanceRetentionEvaluations();
    }
    get(id) {
        const policy = this.store
            .getGovernanceRetentionPolicy(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Governance retention policy ${id} was not found`);
        }
        return policy;
    }
};
exports.RuntimeGovernanceRetentionService = RuntimeGovernanceRetentionService;
exports.RuntimeGovernanceRetentionService = RuntimeGovernanceRetentionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], RuntimeGovernanceRetentionService);
//# sourceMappingURL=runtime-governance-retention.service.js.map