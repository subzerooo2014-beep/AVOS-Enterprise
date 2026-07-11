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
exports.RuntimeGovernanceCheckpointService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
const runtime_governance_snapshot_builder_service_1 = require("./runtime-governance-snapshot-builder.service");
let RuntimeGovernanceCheckpointService = class RuntimeGovernanceCheckpointService {
    constructor(store, snapshots) {
        this.store = store;
        this.snapshots = snapshots;
    }
    create(dto) {
        let previousCheckpoint;
        if (dto.previousCheckpointId) {
            previousCheckpoint =
                this.get(dto.previousCheckpointId);
            if (previousCheckpoint.status ===
                contracts_1.GovernanceCheckpointStatus.INVALID ||
                previousCheckpoint.status ===
                    contracts_1.GovernanceCheckpointStatus.DELETED) {
                throw new common_1.BadRequestException("Previous checkpoint is not valid for chaining");
            }
        }
        const sections = this.snapshots.build(dto.scope);
        const checkpoint = {
            id: (0, crypto_1.randomUUID)(),
            checkpointNumber: this.nextCheckpointNumber(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            type: dto.type,
            status: contracts_1.GovernanceCheckpointStatus.CREATED,
            scope: dto.scope,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            governanceRequestId: dto.governanceRequestId,
            changeExecutionId: dto.changeExecutionId,
            recoveryPlanId: dto.recoveryPlanId,
            sections,
            rootChecksum: this.snapshots.rootChecksum(sections),
            previousCheckpointId: previousCheckpoint?.id,
            previousCheckpointChecksum: previousCheckpoint
                ?.rootChecksum,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: new Date().toISOString(),
            expiresAt: dto.expiresAt,
        };
        return this.store
            .saveGovernanceCheckpoint(checkpoint);
    }
    verify(id) {
        const checkpoint = this.get(id);
        const invalidSections = [];
        for (const section of checkpoint.sections) {
            const actualChecksum = (0, utils_1.governanceSha256Json)(section.data);
            if (actualChecksum !==
                section.checksum) {
                invalidSections.push(section.key);
            }
        }
        const actualRootChecksum = this.snapshots.rootChecksum(checkpoint.sections);
        const valid = invalidSections.length === 0 &&
            actualRootChecksum ===
                checkpoint.rootChecksum;
        checkpoint.status =
            valid
                ? contracts_1.GovernanceCheckpointStatus.VERIFIED
                : contracts_1.GovernanceCheckpointStatus.INVALID;
        checkpoint.verifiedAt =
            new Date().toISOString();
        checkpoint.invalidReason =
            valid
                ? undefined
                : `Invalid sections: ${invalidSections.join(", ")}`;
        this.store
            .saveGovernanceCheckpoint(checkpoint);
        return {
            checkpointId: checkpoint.id,
            valid,
            checkedSections: checkpoint.sections.length,
            invalidSections,
            expectedRootChecksum: checkpoint.rootChecksum,
            actualRootChecksum,
            verifiedAt: checkpoint.verifiedAt,
        };
    }
    markRestoreReady(id) {
        const checkpoint = this.get(id);
        if (checkpoint.status !==
            contracts_1.GovernanceCheckpointStatus.VERIFIED) {
            throw new common_1.BadRequestException("Only verified checkpoints can become restore ready");
        }
        checkpoint.status =
            contracts_1.GovernanceCheckpointStatus.RESTORE_READY;
        return this.store
            .saveGovernanceCheckpoint(checkpoint);
    }
    list() {
        this.expireCheckpoints();
        return this.store
            .listGovernanceCheckpoints();
    }
    get(id) {
        const checkpoint = this.store
            .getGovernanceCheckpoint(id);
        if (!checkpoint) {
            throw new common_1.NotFoundException(`Governance checkpoint ${id} was not found`);
        }
        return checkpoint;
    }
    expireCheckpoints() {
        const now = Date.now();
        for (const checkpoint of this.store
            .listGovernanceCheckpoints()) {
            if (checkpoint.expiresAt &&
                ![
                    contracts_1.GovernanceCheckpointStatus.RESTORED,
                    contracts_1.GovernanceCheckpointStatus.ARCHIVED,
                    contracts_1.GovernanceCheckpointStatus.DELETED,
                    contracts_1.GovernanceCheckpointStatus.EXPIRED,
                ].includes(checkpoint.status) &&
                new Date(checkpoint.expiresAt).getTime() <= now) {
                checkpoint.status =
                    contracts_1.GovernanceCheckpointStatus.EXPIRED;
                this.store
                    .saveGovernanceCheckpoint(checkpoint);
            }
        }
    }
    nextCheckpointNumber() {
        const next = this.store
            .listGovernanceCheckpoints()
            .length + 1;
        return `AVOS-CHK-${String(next).padStart(6, "0")}`;
    }
};
exports.RuntimeGovernanceCheckpointService = RuntimeGovernanceCheckpointService;
exports.RuntimeGovernanceCheckpointService = RuntimeGovernanceCheckpointService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_snapshot_builder_service_1.RuntimeGovernanceSnapshotBuilderService])
], RuntimeGovernanceCheckpointService);
//# sourceMappingURL=runtime-governance-checkpoint.service.js.map