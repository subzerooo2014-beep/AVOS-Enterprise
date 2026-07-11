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
exports.RuntimeMaintenanceModeService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeMaintenanceModeService = class RuntimeMaintenanceModeService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    create(dto) {
        const startsAt = new Date(dto.startsAt);
        const endsAt = dto.endsAt
            ? new Date(dto.endsAt)
            : undefined;
        if (Number.isNaN(startsAt.getTime())) {
            throw new common_1.BadRequestException("Invalid maintenance start date");
        }
        if (endsAt &&
            (Number.isNaN(endsAt.getTime()) ||
                endsAt.getTime() <=
                    startsAt.getTime())) {
            throw new common_1.BadRequestException("Maintenance end must be after start");
        }
        const activeConflict = this.store
            .listMaintenanceModes()
            .find((mode) => mode.environment ===
            dto.environment &&
            mode.namespace ===
                dto.namespace &&
            [
                contracts_1.MaintenanceModeStatus
                    .SCHEDULED,
                contracts_1.MaintenanceModeStatus
                    .ACTIVE,
            ].includes(mode.status));
        if (activeConflict) {
            throw new common_1.BadRequestException(`Maintenance mode already exists for ${dto.environment}/${dto.namespace}`);
        }
        const now = new Date().toISOString();
        const item = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            status: contracts_1.MaintenanceModeStatus
                .INACTIVE,
            startsAt: startsAt.toISOString(),
            endsAt: endsAt?.toISOString(),
            affectedServices: dto.affectedServices,
            allowReadOperations: dto.allowReadOperations,
            allowWriteOperations: dto.allowWriteOperations,
            allowBackgroundJobs: dto.allowBackgroundJobs,
            allowDeployments: dto.allowDeployments,
            publicMessage: dto.publicMessage,
            internalMessage: dto.internalMessage,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store
            .saveMaintenanceMode(item);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .MAINTENANCE_MODE_CREATED,
            aggregateType: "governance_maintenance_mode",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                maintenanceModeId: saved.id,
                key: saved.key,
                environment: saved.environment,
                namespace: saved.namespace,
                status: saved.status,
                startsAt: saved.startsAt,
                endsAt: saved.endsAt ?? null,
                affectedServices: saved.affectedServices,
            },
        });
        return saved;
    }
    list() {
        return this.store
            .listMaintenanceModes()
            .map((mode) => this.normalizeStatus(mode));
    }
    get(id) {
        const item = this.store
            .getMaintenanceMode(id);
        if (!item) {
            throw new common_1.NotFoundException(`Maintenance mode ${id} was not found`);
        }
        return this.normalizeStatus(item);
    }
    updateStatus(id, dto) {
        const item = this.get(id);
        this.validateTransition(item.status, dto.status);
        const now = new Date().toISOString();
        item.status =
            dto.status;
        item.updatedAt =
            now;
        if (dto.status ===
            contracts_1.MaintenanceModeStatus.ACTIVE) {
            item.activatedAt =
                now;
        }
        if (dto.status ===
            contracts_1.MaintenanceModeStatus.COMPLETED) {
            item.completedAt =
                now;
        }
        if (dto.status ===
            contracts_1.MaintenanceModeStatus.CANCELLED) {
            item.cancelledAt =
                now;
        }
        const saved = this.store
            .saveMaintenanceMode(item);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .MAINTENANCE_MODE_UPDATED,
            aggregateType: "governance_maintenance_mode",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                maintenanceModeId: saved.id,
                status: saved.status,
                reason: dto.reason,
                updatedAt: saved.updatedAt,
            },
        });
        return saved;
    }
    getAccessPolicy(environment, namespace, service) {
        const active = this.list().find((mode) => mode.environment ===
            environment &&
            mode.namespace ===
                namespace &&
            mode.status ===
                contracts_1.MaintenanceModeStatus.ACTIVE &&
            (!service ||
                mode.affectedServices.length === 0 ||
                mode.affectedServices.includes(service)));
        if (!active) {
            return {
                maintenanceActive: false,
                allowReadOperations: true,
                allowWriteOperations: true,
                allowBackgroundJobs: true,
                allowDeployments: true,
            };
        }
        return {
            maintenanceActive: true,
            allowReadOperations: active.allowReadOperations,
            allowWriteOperations: active.allowWriteOperations,
            allowBackgroundJobs: active.allowBackgroundJobs,
            allowDeployments: active.allowDeployments,
            publicMessage: active.publicMessage,
        };
    }
    normalizeStatus(item) {
        const now = Date.now();
        const startsAt = new Date(item.startsAt).getTime();
        const endsAt = item.endsAt
            ? new Date(item.endsAt).getTime()
            : undefined;
        if (item.status ===
            contracts_1.MaintenanceModeStatus.SCHEDULED &&
            now >= startsAt &&
            (endsAt === undefined ||
                now < endsAt)) {
            item.status =
                contracts_1.MaintenanceModeStatus.ACTIVE;
            item.activatedAt =
                new Date().toISOString();
            item.updatedAt =
                item.activatedAt;
            return this.store
                .saveMaintenanceMode(item);
        }
        if (item.status ===
            contracts_1.MaintenanceModeStatus.ACTIVE &&
            endsAt !== undefined &&
            now >= endsAt) {
            item.status =
                contracts_1.MaintenanceModeStatus.COMPLETED;
            item.completedAt =
                new Date().toISOString();
            item.updatedAt =
                item.completedAt;
            return this.store
                .saveMaintenanceMode(item);
        }
        return item;
    }
    validateTransition(current, next) {
        if (current === next) {
            return;
        }
        const transitions = {
            [contracts_1.MaintenanceModeStatus.INACTIVE]: [
                contracts_1.MaintenanceModeStatus.SCHEDULED,
                contracts_1.MaintenanceModeStatus.ACTIVE,
                contracts_1.MaintenanceModeStatus.CANCELLED,
            ],
            [contracts_1.MaintenanceModeStatus.SCHEDULED]: [
                contracts_1.MaintenanceModeStatus.ACTIVE,
                contracts_1.MaintenanceModeStatus.CANCELLED,
            ],
            [contracts_1.MaintenanceModeStatus.ACTIVE]: [
                contracts_1.MaintenanceModeStatus.COMPLETED,
                contracts_1.MaintenanceModeStatus.CANCELLED,
            ],
            [contracts_1.MaintenanceModeStatus.COMPLETED]: [],
            [contracts_1.MaintenanceModeStatus.CANCELLED]: [],
        };
        if (!transitions[current].includes(next)) {
            throw new common_1.BadRequestException(`Invalid maintenance mode transition from ${current} to ${next}`);
        }
    }
};
exports.RuntimeMaintenanceModeService = RuntimeMaintenanceModeService;
exports.RuntimeMaintenanceModeService = RuntimeMaintenanceModeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeMaintenanceModeService);
//# sourceMappingURL=runtime-maintenance-mode.service.js.map