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
exports.RuntimeChangeWindowService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeChangeWindowService = class RuntimeChangeWindowService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    create(dto) {
        const startsAt = new Date(dto.startsAt);
        const endsAt = new Date(dto.endsAt);
        if (Number.isNaN(startsAt.getTime()) ||
            Number.isNaN(endsAt.getTime())) {
            throw new common_1.BadRequestException("Invalid change window dates");
        }
        if (endsAt.getTime() <=
            startsAt.getTime()) {
            throw new common_1.BadRequestException("Change window end must be after start");
        }
        const duplicate = this.store
            .listChangeWindows()
            .find((window) => window.key === dto.key &&
            ![
                contracts_1.ChangeWindowStatus.CANCELLED,
                contracts_1.ChangeWindowStatus.EXPIRED,
            ].includes(window.status));
        if (duplicate) {
            throw new common_1.BadRequestException(`Active change window already exists for key ${dto.key}`);
        }
        const now = new Date().toISOString();
        const item = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            type: dto.type,
            status: contracts_1.ChangeWindowStatus.DRAFT,
            startsAt: startsAt.toISOString(),
            endsAt: endsAt.toISOString(),
            timezone: dto.timezone,
            allowedRequestTypes: dto.allowedRequestTypes ?? [],
            blockedRequestTypes: dto.blockedRequestTypes ?? [],
            maximumRiskLevel: dto.maximumRiskLevel,
            requiresApproval: dto.requiresApproval ?? true,
            requiredApprovalCount: dto.requiredApprovalCount ?? 1,
            tags: dto.tags ?? [],
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store.saveChangeWindow(item);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .CHANGE_WINDOW_CREATED,
            aggregateType: "governance_change_window",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                changeWindowId: saved.id,
                key: saved.key,
                environment: saved.environment,
                namespace: saved.namespace,
                type: saved.type,
                status: saved.status,
                startsAt: saved.startsAt,
                endsAt: saved.endsAt,
                maximumRiskLevel: saved.maximumRiskLevel,
            },
        });
        return saved;
    }
    list() {
        return this.store
            .listChangeWindows()
            .map((window) => this.normalizeStatus(window));
    }
    get(id) {
        const item = this.store.getChangeWindow(id);
        if (!item) {
            throw new common_1.NotFoundException(`Change window ${id} was not found`);
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
            contracts_1.ChangeWindowStatus.OPEN) {
            item.openedAt =
                now;
        }
        if (dto.status ===
            contracts_1.ChangeWindowStatus.CLOSED) {
            item.closedAt =
                now;
        }
        if (dto.status ===
            contracts_1.ChangeWindowStatus.CANCELLED) {
            item.cancelledAt =
                now;
        }
        const saved = this.store.saveChangeWindow(item);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .CHANGE_WINDOW_UPDATED,
            aggregateType: "governance_change_window",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                changeWindowId: saved.id,
                status: saved.status,
                reason: dto.reason,
                updatedAt: saved.updatedAt,
            },
        });
        return saved;
    }
    isRequestAllowed(windowId, requestType, riskLevel) {
        const window = this.get(windowId);
        if (window.status !==
            contracts_1.ChangeWindowStatus.OPEN) {
            return {
                allowed: false,
                reason: `Change window is not open: ${window.status}`,
            };
        }
        if (window.blockedRequestTypes.includes(requestType)) {
            return {
                allowed: false,
                reason: "Request type is explicitly blocked",
            };
        }
        if (window.allowedRequestTypes.length > 0 &&
            !window.allowedRequestTypes.includes(requestType)) {
            return {
                allowed: false,
                reason: "Request type is not allowed in this window",
            };
        }
        const rank = {
            informational: 0,
            low: 1,
            medium: 2,
            high: 3,
            critical: 4,
        };
        const requestRank = rank[riskLevel] ?? 99;
        const maximumRank = rank[window.maximumRiskLevel] ?? -1;
        if (requestRank >
            maximumRank) {
            return {
                allowed: false,
                reason: "Request risk exceeds the window maximum risk",
            };
        }
        return {
            allowed: true,
            reason: "Request is allowed in the current change window",
        };
    }
    normalizeStatus(item) {
        const now = Date.now();
        const startsAt = new Date(item.startsAt).getTime();
        const endsAt = new Date(item.endsAt).getTime();
        if (item.status ===
            contracts_1.ChangeWindowStatus.SCHEDULED &&
            now >= startsAt &&
            now < endsAt) {
            item.status =
                contracts_1.ChangeWindowStatus.OPEN;
            item.openedAt =
                new Date().toISOString();
            item.updatedAt =
                item.openedAt;
            return this.store
                .saveChangeWindow(item);
        }
        if ([
            contracts_1.ChangeWindowStatus.SCHEDULED,
            contracts_1.ChangeWindowStatus.OPEN,
        ].includes(item.status) &&
            now >= endsAt) {
            item.status =
                contracts_1.ChangeWindowStatus.EXPIRED;
            item.updatedAt =
                new Date().toISOString();
            return this.store
                .saveChangeWindow(item);
        }
        return item;
    }
    validateTransition(current, next) {
        if (current === next) {
            return;
        }
        const transitions = {
            [contracts_1.ChangeWindowStatus.DRAFT]: [
                contracts_1.ChangeWindowStatus.SCHEDULED,
                contracts_1.ChangeWindowStatus.CANCELLED,
            ],
            [contracts_1.ChangeWindowStatus.SCHEDULED]: [
                contracts_1.ChangeWindowStatus.OPEN,
                contracts_1.ChangeWindowStatus.CANCELLED,
                contracts_1.ChangeWindowStatus.EXPIRED,
            ],
            [contracts_1.ChangeWindowStatus.OPEN]: [
                contracts_1.ChangeWindowStatus.CLOSED,
                contracts_1.ChangeWindowStatus.CANCELLED,
                contracts_1.ChangeWindowStatus.EXPIRED,
            ],
            [contracts_1.ChangeWindowStatus.CLOSED]: [],
            [contracts_1.ChangeWindowStatus.CANCELLED]: [],
            [contracts_1.ChangeWindowStatus.EXPIRED]: [],
        };
        if (!transitions[current].includes(next)) {
            throw new common_1.BadRequestException(`Invalid change window transition from ${current} to ${next}`);
        }
    }
};
exports.RuntimeChangeWindowService = RuntimeChangeWindowService;
exports.RuntimeChangeWindowService = RuntimeChangeWindowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeChangeWindowService);
//# sourceMappingURL=runtime-change-window.service.js.map