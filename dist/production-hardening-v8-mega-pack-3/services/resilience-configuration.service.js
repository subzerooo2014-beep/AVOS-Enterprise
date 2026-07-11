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
exports.ResilienceConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const canonical_json_util_1 = require("../utils/canonical-json.util");
const runtime_hash_util_1 = require("../utils/runtime-hash.util");
const runtime_evidence_chain_service_1 = require("./runtime-evidence-chain.service");
let ResilienceConfigurationService = class ResilienceConfigurationService {
    constructor(store, evidence) {
        this.store = store;
        this.evidence = evidence;
    }
    create(dto) {
        const existingVersions = this.store.findConfigurationsByKey(dto.key);
        const version = existingVersions.length === 0
            ? 1
            : Math.max(...existingVersions.map((item) => item.version)) + 1;
        const previousConfiguration = existingVersions.find((item) => item.status === runtime_resilience_enums_1.ResilienceConfigurationStatus.ACTIVE ||
            item.status === runtime_resilience_enums_1.ResilienceConfigurationStatus.APPROVED);
        const now = new Date().toISOString();
        const requiresApproval = dto.requiresApproval ??
            dto.environment === runtime_resilience_enums_1.RuntimeEnvironment.PRODUCTION;
        const minimumApprovals = Math.max(0, dto.minimumApprovals ??
            (dto.environment === "production" ? 2 : 1));
        const payload = (0, canonical_json_util_1.cloneJson)(dto.payload);
        const configuration = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            version,
            status: runtime_resilience_enums_1.ResilienceConfigurationStatus.DRAFT,
            controlMode: dto.controlMode,
            changeType: dto.changeType,
            payload,
            payloadHash: (0, runtime_hash_util_1.sha256Json)(payload),
            tags: dto.tags ?? [],
            requiresApproval,
            minimumApprovals,
            approvals: [],
            previousConfigurationId: previousConfiguration?.id,
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store.saveConfiguration(configuration);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.CONFIGURATION_CREATED,
            aggregateType: "resilience_configuration",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                configurationId: saved.id,
                key: saved.key,
                version: saved.version,
                environment: saved.environment,
                namespace: saved.namespace,
                status: saved.status,
                payloadHash: saved.payloadHash,
                requiresApproval: saved.requiresApproval,
                minimumApprovals: saved.minimumApprovals,
            },
        });
        return saved;
    }
    list() {
        return this.store.listConfigurations();
    }
    get(id) {
        const item = this.store.getConfiguration(id);
        if (!item) {
            throw new common_1.NotFoundException(`Resilience configuration ${id} was not found`);
        }
        return item;
    }
    submit(id, dto) {
        const configuration = this.get(id);
        if (configuration.status !== runtime_resilience_enums_1.ResilienceConfigurationStatus.DRAFT) {
            throw new common_1.BadRequestException(`Only draft configurations can be submitted. Current status: ${configuration.status}`);
        }
        const now = new Date().toISOString();
        configuration.status = configuration.requiresApproval
            ? runtime_resilience_enums_1.ResilienceConfigurationStatus.PENDING_APPROVAL
            : runtime_resilience_enums_1.ResilienceConfigurationStatus.APPROVED;
        configuration.submittedAt = now;
        configuration.updatedAt = now;
        const saved = this.store.saveConfiguration(configuration);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.CONFIGURATION_SUBMITTED,
            aggregateType: "resilience_configuration",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                configurationId: saved.id,
                status: saved.status,
                reason: dto.reason ?? null,
                context: (dto.context ?? {}),
            },
        });
        return saved;
    }
    approve(id, dto) {
        const configuration = this.get(id);
        if (configuration.status !==
            runtime_resilience_enums_1.ResilienceConfigurationStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException(`Configuration is not pending approval. Current status: ${configuration.status}`);
        }
        const duplicateDecision = configuration.approvals.find((approval) => approval.actor.id === dto.actor.id);
        if (duplicateDecision) {
            throw new common_1.ConflictException(`Actor ${dto.actor.id} already submitted a decision`);
        }
        const now = new Date().toISOString();
        configuration.approvals.push({
            id: (0, crypto_1.randomUUID)(),
            configurationId: configuration.id,
            decision: dto.decision,
            actor: dto.actor,
            reason: dto.reason,
            decidedAt: now,
        });
        if (dto.decision === runtime_resilience_enums_1.ApprovalDecision.REJECTED) {
            configuration.status =
                runtime_resilience_enums_1.ResilienceConfigurationStatus.REJECTED;
            configuration.rejectionReason = dto.reason;
            configuration.rejectedAt = now;
            configuration.updatedAt = now;
            const rejected = this.store.saveConfiguration(configuration);
            this.evidence.append({
                type: runtime_resilience_enums_1.EvidenceEntryType.CONFIGURATION_REJECTED,
                aggregateType: "resilience_configuration",
                aggregateId: rejected.id,
                actor: dto.actor,
                payload: {
                    configurationId: rejected.id,
                    reason: dto.reason,
                    approvals: rejected.approvals.length,
                },
            });
            return rejected;
        }
        const approvedCount = configuration.approvals.filter((approval) => approval.decision === runtime_resilience_enums_1.ApprovalDecision.APPROVED).length;
        if (approvedCount >= configuration.minimumApprovals) {
            configuration.status =
                runtime_resilience_enums_1.ResilienceConfigurationStatus.APPROVED;
        }
        configuration.updatedAt = now;
        const approved = this.store.saveConfiguration(configuration);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.CONFIGURATION_APPROVED,
            aggregateType: "resilience_configuration",
            aggregateId: approved.id,
            actor: dto.actor,
            payload: {
                configurationId: approved.id,
                status: approved.status,
                approvedCount,
                minimumApprovals: approved.minimumApprovals,
                reason: dto.reason,
            },
        });
        return approved;
    }
    activate(id, actor) {
        const configuration = this.get(id);
        if (configuration.status !==
            runtime_resilience_enums_1.ResilienceConfigurationStatus.APPROVED &&
            !(configuration.status ===
                runtime_resilience_enums_1.ResilienceConfigurationStatus.DRAFT &&
                configuration.requiresApproval === false)) {
            throw new common_1.BadRequestException(`Configuration must be approved before activation. Current status: ${configuration.status}`);
        }
        if (this.store.getControlMode() === runtime_resilience_enums_1.RuntimeControlMode.LOCKDOWN) {
            throw new common_1.BadRequestException("Runtime control plane is in lockdown mode");
        }
        const activeVersions = this.store
            .findConfigurationsByKey(configuration.key)
            .filter((item) => item.status === runtime_resilience_enums_1.ResilienceConfigurationStatus.ACTIVE &&
            item.id !== configuration.id);
        const now = new Date().toISOString();
        for (const active of activeVersions) {
            active.status = runtime_resilience_enums_1.ResilienceConfigurationStatus.SUPERSEDED;
            active.updatedAt = now;
            this.store.saveConfiguration(active);
        }
        configuration.status = runtime_resilience_enums_1.ResilienceConfigurationStatus.ACTIVE;
        configuration.activatedAt = now;
        configuration.updatedAt = now;
        const saved = this.store.saveConfiguration(configuration);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.CONFIGURATION_ACTIVATED,
            aggregateType: "resilience_configuration",
            aggregateId: saved.id,
            actor,
            payload: {
                configurationId: saved.id,
                key: saved.key,
                version: saved.version,
                payloadHash: saved.payloadHash,
                supersededConfigurationIds: activeVersions.map((item) => item.id),
            },
        });
        return saved;
    }
    rollback(id, dto) {
        const current = this.get(id);
        if (current.status !== runtime_resilience_enums_1.ResilienceConfigurationStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Only active configurations can be rolled back. Current status: ${current.status}`);
        }
        let target;
        if (dto.targetConfigurationId) {
            target = this.store.getConfiguration(dto.targetConfigurationId);
        }
        else if (current.previousConfigurationId) {
            target = this.store.getConfiguration(current.previousConfigurationId);
        }
        if (!target) {
            throw new common_1.NotFoundException("Rollback target configuration was not found");
        }
        if (target.key !== current.key ||
            target.environment !== current.environment ||
            target.namespace !== current.namespace) {
            throw new common_1.BadRequestException("Rollback target does not belong to the same configuration scope");
        }
        const now = new Date().toISOString();
        current.status = runtime_resilience_enums_1.ResilienceConfigurationStatus.ROLLED_BACK;
        current.rolledBackAt = now;
        current.updatedAt = now;
        current.rollbackTarget = {
            configurationId: target.id,
            configurationVersion: target.version,
            baselineId: dto.baselineId,
            reason: dto.reason,
        };
        target.status = runtime_resilience_enums_1.ResilienceConfigurationStatus.ACTIVE;
        target.activatedAt = now;
        target.updatedAt = now;
        this.store.saveConfiguration(current);
        const restored = this.store.saveConfiguration(target);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.CONFIGURATION_ROLLED_BACK,
            aggregateType: "resilience_configuration",
            aggregateId: current.id,
            actor: dto.actor,
            payload: {
                rolledBackConfigurationId: current.id,
                restoredConfigurationId: restored.id,
                restoredVersion: restored.version,
                baselineId: dto.baselineId ?? null,
                reason: dto.reason,
            },
        });
        return restored;
    }
};
exports.ResilienceConfigurationService = ResilienceConfigurationService;
exports.ResilienceConfigurationService = ResilienceConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService])
], ResilienceConfigurationService);
//# sourceMappingURL=resilience-configuration.service.js.map