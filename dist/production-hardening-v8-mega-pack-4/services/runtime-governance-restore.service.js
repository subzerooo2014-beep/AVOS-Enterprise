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
exports.RuntimeGovernanceRestoreService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_archive_service_1 = require("./runtime-governance-archive.service");
const runtime_governance_checkpoint_service_1 = require("./runtime-governance-checkpoint.service");
let RuntimeGovernanceRestoreService = class RuntimeGovernanceRestoreService {
    constructor(store, archives, checkpoints) {
        this.store = store;
        this.archives = archives;
        this.checkpoints = checkpoints;
    }
    create(dto) {
        if (!dto.archiveId &&
            !dto.checkpointId) {
            throw new common_1.BadRequestException("Restore plan requires archiveId or checkpointId");
        }
        if (dto.archiveId &&
            dto.checkpointId) {
            throw new common_1.BadRequestException("Restore plan cannot use archiveId and checkpointId together");
        }
        let sections = [];
        if (dto.archiveId) {
            const archive = this.archives.get(dto.archiveId);
            sections =
                archive.sections;
        }
        if (dto.checkpointId) {
            const checkpoint = this.checkpoints.get(dto.checkpointId);
            sections =
                checkpoint.sections;
        }
        const now = new Date().toISOString();
        const plan = {
            id: (0, crypto_1.randomUUID)(),
            restoreNumber: this.nextRestoreNumber(),
            name: dto.name,
            description: dto.description,
            status: contracts_1.GovernanceRestoreStatus.DRAFT,
            archiveId: dto.archiveId,
            checkpointId: dto.checkpointId,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            targetScope: dto.targetScope,
            dryRun: dto.dryRun,
            validations: [],
            restoreSections: dto.restoreSections ??
                sections.map((section) => section.key),
            conflictStrategy: dto.conflictStrategy,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        return this.store
            .saveGovernanceRestorePlan(plan);
    }
    validate(id) {
        const plan = this.get(id);
        plan.status =
            contracts_1.GovernanceRestoreStatus.VALIDATING;
        const validations = [];
        const source = this.resolveSource(plan);
        validations.push(this.validation("source_status", "Restore source is verified", source.verified, true, true, source.verified, "Restore source must be verified"));
        validations.push(this.validation("restore_sections", "Restore sections exist", plan.restoreSections.length > 0, true, true, plan.restoreSections.length > 0, "Restore plan requires at least one section"));
        validations.push(this.validation("source_sections_available", "Requested sections exist in source", plan.restoreSections.every((section) => source.sections.some((item) => item.key === section)), true, true, plan.restoreSections.every((section) => source.sections.some((item) => item.key === section)), "Every requested restore section must exist"));
        plan.validations =
            validations;
        const blocked = validations.some((item) => item.blocking &&
            !item.success);
        plan.status =
            blocked
                ? contracts_1.GovernanceRestoreStatus.BLOCKED
                : contracts_1.GovernanceRestoreStatus.READY;
        plan.validatedAt =
            new Date().toISOString();
        plan.updatedAt =
            plan.validatedAt;
        return this.store
            .saveGovernanceRestorePlan(plan);
    }
    execute(id, dto) {
        let plan = this.get(id);
        if (plan.status ===
            contracts_1.GovernanceRestoreStatus.DRAFT) {
            plan =
                this.validate(id);
        }
        if (plan.status !==
            contracts_1.GovernanceRestoreStatus.READY) {
            throw new common_1.BadRequestException(`Restore plan is not ready. Current status: ${plan.status}`);
        }
        if (!plan.dryRun &&
            dto.confirmExecution !== true) {
            throw new common_1.BadRequestException("Non-dry-run restore requires confirmExecution=true");
        }
        plan.status =
            contracts_1.GovernanceRestoreStatus.EXECUTING;
        plan.startedAt =
            new Date().toISOString();
        plan.updatedAt =
            plan.startedAt;
        plan =
            this.store
                .saveGovernanceRestorePlan(plan);
        try {
            const source = this.resolveSource(plan);
            const selectedSections = source.sections.filter((section) => plan.restoreSections
                .includes(section.key));
            plan.metadata = {
                ...plan.metadata,
                restoredSectionCount: selectedSections.length,
                restoredRecordCount: selectedSections.reduce((total, section) => total +
                    section.count, 0),
                dryRun: plan.dryRun,
                conflictStrategy: plan.conflictStrategy,
                runtimeContext: (dto.runtimeContext ?? {}),
            };
            plan.status =
                contracts_1.GovernanceRestoreStatus.SUCCEEDED;
            plan.completedAt =
                new Date().toISOString();
            plan.updatedAt =
                plan.completedAt;
            if (plan.archiveId) {
                const archive = this.archives.get(plan.archiveId);
                archive.status =
                    contracts_1.GovernanceArchiveStatus.RESTORED;
                archive.restoredAt =
                    plan.completedAt;
                this.store
                    .saveGovernanceArchive(archive);
            }
            if (plan.checkpointId) {
                const checkpoint = this.checkpoints.get(plan.checkpointId);
                checkpoint.status =
                    contracts_1.GovernanceCheckpointStatus.RESTORED;
                checkpoint.restoredAt =
                    plan.completedAt;
                this.store
                    .saveGovernanceCheckpoint(checkpoint);
            }
            return this.store
                .saveGovernanceRestorePlan(plan);
        }
        catch (error) {
            plan.status =
                contracts_1.GovernanceRestoreStatus.FAILED;
            plan.failedAt =
                new Date().toISOString();
            plan.updatedAt =
                plan.failedAt;
            plan.error =
                error instanceof Error
                    ? error.message
                    : "Unknown restore failure";
            return this.store
                .saveGovernanceRestorePlan(plan);
        }
    }
    list() {
        return this.store
            .listGovernanceRestorePlans();
    }
    get(id) {
        const plan = this.store
            .getGovernanceRestorePlan(id);
        if (!plan) {
            throw new common_1.NotFoundException(`Governance restore plan ${id} was not found`);
        }
        return plan;
    }
    resolveSource(plan) {
        if (plan.archiveId) {
            const archive = this.archives.get(plan.archiveId);
            return {
                verified: archive.status ===
                    contracts_1.GovernanceArchiveStatus.VERIFIED,
                sections: archive.sections,
            };
        }
        if (plan.checkpointId) {
            const checkpoint = this.checkpoints.get(plan.checkpointId);
            return {
                verified: [
                    contracts_1.GovernanceCheckpointStatus.VERIFIED,
                    contracts_1.GovernanceCheckpointStatus.RESTORE_READY,
                ].includes(checkpoint.status),
                sections: checkpoint.sections,
            };
        }
        throw new common_1.BadRequestException("Restore source is missing");
    }
    validation(key, name, success, blocking, expected, actual, reason) {
        return {
            id: (0, crypto_1.randomUUID)(),
            key,
            name,
            success,
            blocking,
            expected,
            actual,
            reason,
            checkedAt: new Date().toISOString(),
        };
    }
    nextRestoreNumber() {
        const next = this.store
            .listGovernanceRestorePlans()
            .length + 1;
        return `AVOS-RST-${String(next).padStart(6, "0")}`;
    }
};
exports.RuntimeGovernanceRestoreService = RuntimeGovernanceRestoreService;
exports.RuntimeGovernanceRestoreService = RuntimeGovernanceRestoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_archive_service_1.RuntimeGovernanceArchiveService,
        runtime_governance_checkpoint_service_1.RuntimeGovernanceCheckpointService])
], RuntimeGovernanceRestoreService);
//# sourceMappingURL=runtime-governance-restore.service.js.map