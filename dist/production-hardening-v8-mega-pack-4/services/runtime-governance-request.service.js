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
exports.RuntimeGovernanceRequestService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
const runtime_change_window_service_1 = require("./runtime-change-window.service");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
const runtime_maintenance_mode_service_1 = require("./runtime-maintenance-mode.service");
let RuntimeGovernanceRequestService = class RuntimeGovernanceRequestService {
    constructor(store, audit, changeWindows, maintenance) {
        this.store = store;
        this.audit = audit;
        this.changeWindows = changeWindows;
        this.maintenance = maintenance;
    }
    create(dto) {
        if (dto.changeWindowId) {
            this.changeWindows.get(dto.changeWindowId);
        }
        if (dto.maintenanceModeId) {
            this.maintenance.get(dto.maintenanceModeId);
        }
        const now = new Date().toISOString();
        const item = {
            id: (0, crypto_1.randomUUID)(),
            requestNumber: this.nextRequestNumber(),
            type: dto.type,
            status: contracts_1.GovernanceRequestStatus.PENDING,
            title: dto.title,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            requestedRiskLevel: dto.requestedRiskLevel,
            changeWindowId: dto.changeWindowId,
            maintenanceModeId: dto.maintenanceModeId,
            rollbackPlanAvailable: dto.rollbackPlanAvailable,
            testCoverage: dto.testCoverage,
            blastRadius: dto.blastRadius,
            businessCriticality: dto.businessCriticality,
            approvalsRequired: dto.approvalsRequired ??
                (0, utils_1.approvalsFromGovernanceRisk)(dto.requestedRiskLevel),
            approvals: [],
            evaluationFactors: [],
            recommendations: [],
            payload: dto.payload,
            metadata: (dto.metadata ?? {}),
            requestedBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store
            .saveGovernanceRequest(item);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .GOVERNANCE_REQUEST_CREATED,
            aggregateType: "governance_request",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                requestId: saved.id,
                requestNumber: saved.requestNumber,
                type: saved.type,
                environment: saved.environment,
                namespace: saved.namespace,
                requestedRiskLevel: saved.requestedRiskLevel,
                approvalsRequired: saved.approvalsRequired,
            },
        });
        return saved;
    }
    list() {
        return this.store
            .listGovernanceRequests();
    }
    get(id) {
        const item = this.store
            .getGovernanceRequest(id);
        if (!item) {
            throw new common_1.NotFoundException(`Governance request ${id} was not found`);
        }
        return item;
    }
    recordApproval(id, dto) {
        const item = this.get(id);
        if (![
            contracts_1.GovernanceRequestStatus.PENDING,
            contracts_1.GovernanceRequestStatus.EVALUATING,
            contracts_1.GovernanceRequestStatus.DEFERRED,
        ].includes(item.status)) {
            throw new common_1.BadRequestException(`Request cannot receive approvals in status ${item.status}`);
        }
        const existing = item.approvals.find((approval) => approval.actor.id ===
            dto.actor.id);
        if (existing) {
            throw new common_1.BadRequestException(`Actor ${dto.actor.id} already recorded an approval decision`);
        }
        const now = new Date().toISOString();
        item.approvals.push({
            id: (0, crypto_1.randomUUID)(),
            requestId: item.id,
            status: dto.status,
            actor: dto.actor,
            reason: dto.reason,
            createdAt: now,
            expiresAt: dto.expiresAt,
        });
        if (dto.status ===
            contracts_1.GovernanceApprovalStatus.REJECTED) {
            item.status =
                contracts_1.GovernanceRequestStatus.REJECTED;
            item.decision =
                contracts_1.GovernanceDecision.BLOCK;
            item.rejectedAt =
                now;
        }
        else {
            const approvedCount = item.approvals.filter((approval) => approval.status ===
                contracts_1.GovernanceApprovalStatus.APPROVED &&
                (!approval.expiresAt ||
                    new Date(approval.expiresAt).getTime() > Date.now())).length;
            if (approvedCount >=
                item.approvalsRequired) {
                item.status =
                    contracts_1.GovernanceRequestStatus.APPROVED;
                item.decision =
                    contracts_1.GovernanceDecision.ALLOW;
                item.approvedAt =
                    now;
            }
        }
        item.updatedAt =
            now;
        const saved = this.store
            .saveGovernanceRequest(item);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .APPROVAL_RECORDED,
            aggregateType: "governance_request",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                requestId: saved.id,
                approvalStatus: dto.status,
                requestStatus: saved.status,
                approvalsRequired: saved.approvalsRequired,
                approvedCount: saved.approvals.filter((approval) => approval.status ===
                    contracts_1.GovernanceApprovalStatus.APPROVED).length,
                reason: dto.reason,
            },
        });
        return saved;
    }
    markExecuted(id, actor) {
        const item = this.get(id);
        if (item.status !==
            contracts_1.GovernanceRequestStatus.APPROVED) {
            throw new common_1.BadRequestException(`Only approved requests can be executed. Current status: ${item.status}`);
        }
        if (this.store.getControlMode() ===
            contracts_1.GovernanceControlMode.LOCKDOWN) {
            throw new common_1.BadRequestException("Governance control plane is in lockdown mode");
        }
        const maintenancePolicy = this.maintenance.getAccessPolicy(item.environment, item.namespace, item.service);
        if (item.type === "deployment" &&
            !maintenancePolicy.allowDeployments) {
            throw new common_1.BadRequestException("Deployments are blocked by active maintenance mode");
        }
        item.status =
            contracts_1.GovernanceRequestStatus.EXECUTED;
        item.executedAt =
            new Date().toISOString();
        item.updatedAt =
            item.executedAt;
        const saved = this.store
            .saveGovernanceRequest(item);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .GOVERNANCE_REQUEST_EVALUATED,
            aggregateType: "governance_request",
            aggregateId: saved.id,
            actor,
            payload: {
                requestId: saved.id,
                status: saved.status,
                executedAt: saved.executedAt ?? null,
            },
        });
        return saved;
    }
    nextRequestNumber() {
        const next = this.store
            .listGovernanceRequests()
            .length + 1;
        return `AVOS-GOV-${String(next).padStart(6, "0")}`;
    }
};
exports.RuntimeGovernanceRequestService = RuntimeGovernanceRequestService;
exports.RuntimeGovernanceRequestService = RuntimeGovernanceRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService,
        runtime_change_window_service_1.RuntimeChangeWindowService,
        runtime_maintenance_mode_service_1.RuntimeMaintenanceModeService])
], RuntimeGovernanceRequestService);
//# sourceMappingURL=runtime-governance-request.service.js.map