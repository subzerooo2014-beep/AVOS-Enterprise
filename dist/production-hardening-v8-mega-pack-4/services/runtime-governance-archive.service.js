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
exports.RuntimeGovernanceArchiveService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
const runtime_governance_checkpoint_service_1 = require("./runtime-governance-checkpoint.service");
const runtime_governance_snapshot_builder_service_1 = require("./runtime-governance-snapshot-builder.service");
let RuntimeGovernanceArchiveService = class RuntimeGovernanceArchiveService {
    constructor(store, checkpoints, snapshots) {
        this.store = store;
        this.checkpoints = checkpoints;
        this.snapshots = snapshots;
    }
    create(dto) {
        let sections = [];
        if (dto.checkpointId) {
            const checkpoint = this.checkpoints.get(dto.checkpointId);
            sections =
                checkpoint.sections;
            if (checkpoint.status ===
                "invalid" ||
                checkpoint.status ===
                    "deleted") {
                throw new common_1.BadRequestException("Archive cannot be created from invalid checkpoint");
            }
        }
        else {
            sections =
                this.resolveArchiveSections(dto.type);
        }
        const now = new Date().toISOString();
        const archive = {
            id: (0, crypto_1.randomUUID)(),
            archiveNumber: this.nextArchiveNumber(),
            type: dto.type,
            status: contracts_1.GovernanceArchiveStatus.READY,
            name: dto.name,
            description: dto.description,
            classification: dto.classification,
            environment: dto.environment,
            namespace: dto.namespace,
            sourceResourceIds: dto.sourceResourceIds ?? [],
            checkpointId: dto.checkpointId,
            sections,
            recordCount: sections.reduce((total, section) => total +
                section.count, 0),
            rootChecksum: this.snapshots
                .rootChecksum(sections),
            compressed: dto.compressed,
            encrypted: dto.encrypted,
            immutable: dto.immutable,
            retentionPolicyId: dto.retentionPolicyId,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            readyAt: now,
            expiresAt: dto.expiresAt,
        };
        return this.store
            .saveGovernanceArchive(archive);
    }
    verify(id) {
        const archive = this.get(id);
        const invalidSections = [];
        for (const section of archive.sections) {
            const actualChecksum = (0, utils_1.governanceSha256Json)(section.data);
            if (actualChecksum !==
                section.checksum) {
                invalidSections.push(section.key);
            }
        }
        const actualRootChecksum = this.snapshots.rootChecksum(archive.sections);
        const valid = invalidSections.length === 0 &&
            actualRootChecksum ===
                archive.rootChecksum;
        archive.status =
            valid
                ? contracts_1.GovernanceArchiveStatus.VERIFIED
                : contracts_1.GovernanceArchiveStatus.FAILED;
        archive.verifiedAt =
            new Date().toISOString();
        archive.error =
            valid
                ? undefined
                : `Invalid archive sections: ${invalidSections.join(", ")}`;
        this.store
            .saveGovernanceArchive(archive);
        return {
            archiveId: archive.id,
            valid,
            recordCount: archive.recordCount,
            checkedSections: archive.sections.length,
            invalidSections,
            expectedRootChecksum: archive.rootChecksum,
            actualRootChecksum,
            verifiedAt: archive.verifiedAt,
        };
    }
    list() {
        return this.store
            .listGovernanceArchives();
    }
    get(id) {
        const archive = this.store
            .getGovernanceArchive(id);
        if (!archive) {
            throw new common_1.NotFoundException(`Governance archive ${id} was not found`);
        }
        return archive;
    }
    resolveArchiveSections(type) {
        switch (type) {
            case contracts_1.GovernanceArchiveType.AUDIT:
                return [
                    this.section("auditEntries", this.store
                        .listAuditEntries()),
                ];
            case contracts_1.GovernanceArchiveType.EXECUTION_EVIDENCE:
                return [
                    this.section("executionEvidence", this.store
                        .listExecutionEvidence()),
                ];
            case contracts_1.GovernanceArchiveType.TIMELINE:
                return [
                    this.section("timeline", this.store
                        .listGovernanceTimeline()),
                ];
            case contracts_1.GovernanceArchiveType.REQUEST_HISTORY:
                return [
                    this.section("governanceRequests", this.store
                        .listGovernanceRequests()),
                ];
            case contracts_1.GovernanceArchiveType.DECISION_HISTORY:
                return [
                    this.section("decisionRecords", this.store
                        .listDecisionRecords()),
                ];
            case contracts_1.GovernanceArchiveType.OPERATIONS:
                return this.snapshots.build(contracts_1.GovernanceSnapshotScope.OPERATIONS);
            case contracts_1.GovernanceArchiveType.CHECKPOINT:
            case contracts_1.GovernanceArchiveType.FULL_EXPORT:
            default:
                return this.snapshots.build(contracts_1.GovernanceSnapshotScope.FULL);
        }
    }
    section(key, data) {
        return {
            key,
            count: data.length,
            checksum: (0, utils_1.governanceSha256Json)(data),
            data: data,
        };
    }
    nextArchiveNumber() {
        const next = this.store
            .listGovernanceArchives()
            .length + 1;
        return `AVOS-ARC-${String(next).padStart(6, "0")}`;
    }
};
exports.RuntimeGovernanceArchiveService = RuntimeGovernanceArchiveService;
exports.RuntimeGovernanceArchiveService = RuntimeGovernanceArchiveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_checkpoint_service_1.RuntimeGovernanceCheckpointService,
        runtime_governance_snapshot_builder_service_1.RuntimeGovernanceSnapshotBuilderService])
], RuntimeGovernanceArchiveService);
//# sourceMappingURL=runtime-governance-archive.service.js.map