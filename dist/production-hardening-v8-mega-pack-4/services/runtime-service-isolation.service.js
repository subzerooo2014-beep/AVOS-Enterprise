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
exports.RuntimeServiceIsolationService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeServiceIsolationService = class RuntimeServiceIsolationService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    create(dto) {
        const source = this.store.getDependencyNode(dto.sourceNodeId);
        if (!source) {
            throw new common_1.NotFoundException(`Dependency node ${dto.sourceNodeId} was not found`);
        }
        const rules = dto.rules.map((rule) => {
            if (!this.store.getDependencyNode(rule.nodeId)) {
                throw new common_1.NotFoundException(`Isolation rule node ${rule.nodeId} was not found`);
            }
            return {
                id: (0, crypto_1.randomUUID)(),
                nodeId: rule.nodeId,
                strategy: rule.strategy,
                trafficPercentage: rule.trafficPercentage,
                blockIncomingTraffic: rule.blockIncomingTraffic,
                blockOutgoingTraffic: rule.blockOutgoingTraffic,
                pauseBackgroundJobs: rule.pauseBackgroundJobs,
                disableDependencies: rule.disableDependencies ?? [],
                preserveDependencies: rule.preserveDependencies ?? [],
                reason: rule.reason,
                metadata: (rule.metadata ?? {}),
            };
        });
        const affectedNodeIds = Array.from(new Set([
            dto.sourceNodeId,
            ...rules.map((rule) => rule.nodeId),
        ]));
        const affectedServices = Array.from(new Set(affectedNodeIds
            .map((nodeId) => this.store
            .getDependencyNode(nodeId)?.service)
            .filter((service) => Boolean(service))));
        const now = new Date().toISOString();
        const plan = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            sourceNodeId: dto.sourceNodeId,
            status: contracts_1.IsolationPlanStatus.READY,
            strategy: dto.strategy,
            riskLevel: dto.riskLevel,
            affectedNodeIds,
            affectedServices,
            rules,
            recommendations: this.buildRecommendations(dto.strategy, rules),
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store.saveIsolationPlan(plan);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .DEPENDENCY_HEALTH_UPDATED,
            aggregateType: "service_isolation_plan",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                isolationPlanId: saved.id,
                strategy: saved.strategy,
                status: saved.status,
                affectedNodeIds: saved.affectedNodeIds,
                affectedServices: saved.affectedServices,
            },
        });
        return saved;
    }
    list() {
        return this.store
            .listIsolationPlans();
    }
    get(id) {
        const plan = this.store.getIsolationPlan(id);
        if (!plan) {
            throw new common_1.NotFoundException(`Isolation plan ${id} was not found`);
        }
        return plan;
    }
    updateStatus(id, dto) {
        const plan = this.get(id);
        this.validateTransition(plan.status, dto.status);
        const now = new Date().toISOString();
        plan.status =
            dto.status;
        plan.updatedAt =
            now;
        if (dto.status ===
            contracts_1.IsolationPlanStatus.ACTIVE) {
            plan.activatedAt =
                now;
        }
        if (dto.status ===
            contracts_1.IsolationPlanStatus.COMPLETED) {
            plan.completedAt =
                now;
        }
        if (dto.status ===
            contracts_1.IsolationPlanStatus.CANCELLED) {
            plan.cancelledAt =
                now;
        }
        if (dto.status ===
            contracts_1.IsolationPlanStatus.FAILED) {
            plan.failedAt =
                now;
            plan.error =
                dto.reason;
        }
        return this.store
            .saveIsolationPlan(plan);
    }
    buildRecommendations(strategy, rules) {
        const recommendations = [];
        if (strategy ===
            contracts_1.IsolationStrategy.FULL) {
            recommendations.push("Notify all dependent service owners before activation");
            recommendations.push("Validate fallback paths before full isolation");
        }
        if (rules.some((rule) => rule.trafficPercentage >= 80)) {
            recommendations.push("Enable enhanced traffic monitoring");
        }
        if (rules.some((rule) => rule.pauseBackgroundJobs)) {
            recommendations.push("Prepare controlled job resumption sequence");
        }
        if (recommendations.length === 0) {
            recommendations.push("Proceed with standard isolation monitoring");
        }
        return recommendations;
    }
    validateTransition(current, next) {
        if (current === next) {
            return;
        }
        const transitions = {
            [contracts_1.IsolationPlanStatus.DRAFT]: [
                contracts_1.IsolationPlanStatus.READY,
                contracts_1.IsolationPlanStatus.CANCELLED,
            ],
            [contracts_1.IsolationPlanStatus.READY]: [
                contracts_1.IsolationPlanStatus.ACTIVE,
                contracts_1.IsolationPlanStatus.CANCELLED,
            ],
            [contracts_1.IsolationPlanStatus.ACTIVE]: [
                contracts_1.IsolationPlanStatus.COMPLETED,
                contracts_1.IsolationPlanStatus.FAILED,
                contracts_1.IsolationPlanStatus.CANCELLED,
            ],
            [contracts_1.IsolationPlanStatus.COMPLETED]: [],
            [contracts_1.IsolationPlanStatus.CANCELLED]: [],
            [contracts_1.IsolationPlanStatus.FAILED]: [
                contracts_1.IsolationPlanStatus.READY,
                contracts_1.IsolationPlanStatus.CANCELLED,
            ],
        };
        if (!transitions[current].includes(next)) {
            throw new common_1.BadRequestException(`Invalid isolation plan transition from ${current} to ${next}`);
        }
    }
};
exports.RuntimeServiceIsolationService = RuntimeServiceIsolationService;
exports.RuntimeServiceIsolationService = RuntimeServiceIsolationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeServiceIsolationService);
//# sourceMappingURL=runtime-service-isolation.service.js.map