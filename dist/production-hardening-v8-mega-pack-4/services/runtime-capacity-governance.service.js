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
exports.RuntimeCapacityGovernanceService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeCapacityGovernanceService = class RuntimeCapacityGovernanceService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    create(dto) {
        if (dto.maximumInstances <
            dto.minimumInstances) {
            throw new common_1.BadRequestException("Maximum instances must be greater than or equal to minimum instances");
        }
        const duplicate = this.store
            .listCapacityPolicies()
            .find((policy) => policy.key === dto.key &&
            policy.environment ===
                dto.environment &&
            policy.namespace ===
                dto.namespace &&
            policy.service ===
                dto.service);
        if (duplicate) {
            throw new common_1.BadRequestException(`Capacity policy already exists for key ${dto.key}`);
        }
        const now = new Date().toISOString();
        const policy = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            metricType: dto.metricType,
            metricName: dto.metricName,
            status: contracts_1.CapacityPolicyStatus.ACTIVE,
            thresholds: dto.thresholds,
            minimumInstances: dto.minimumInstances,
            maximumInstances: dto.maximumInstances,
            scaleStep: dto.scaleStep,
            cooldownSeconds: dto.cooldownSeconds,
            allowAutomaticScaling: dto.allowAutomaticScaling,
            blockChangesWhenCritical: dto.blockChangesWhenCritical,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
            activatedAt: now,
        };
        const saved = this.store.saveCapacityPolicy(policy);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .SLO_REGISTERED,
            aggregateType: "runtime_capacity_policy",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                capacityPolicyId: saved.id,
                key: saved.key,
                service: saved.service,
                metricType: saved.metricType,
                metricName: saved.metricName,
                status: saved.status,
                minimumInstances: saved.minimumInstances,
                maximumInstances: saved.maximumInstances,
            },
        });
        return saved;
    }
    evaluate(id, dto) {
        const policy = this.get(id);
        if (policy.status !==
            contracts_1.CapacityPolicyStatus.ACTIVE) {
            throw new common_1.BadRequestException("Capacity policy is not active");
        }
        let status = contracts_1.CapacityEvaluationStatus.HEALTHY;
        let decision = contracts_1.CapacityDecision.NO_ACTION;
        let recommendedInstances = dto.currentInstances;
        let reason = "Capacity is within policy limits";
        if (dto.actualValue >=
            policy.thresholds.critical) {
            status =
                contracts_1.CapacityEvaluationStatus.CRITICAL;
            if (policy.allowAutomaticScaling &&
                dto.currentInstances <
                    policy.maximumInstances) {
                decision =
                    contracts_1.CapacityDecision.SCALE_OUT;
                recommendedInstances =
                    Math.min(policy.maximumInstances, dto.currentInstances +
                        policy.scaleStep);
                reason =
                    "Critical capacity threshold exceeded";
            }
            else if (policy.blockChangesWhenCritical) {
                decision =
                    contracts_1.CapacityDecision.BLOCK_CHANGE;
                reason =
                    "Critical capacity threshold exceeded and changes are blocked";
            }
            else {
                decision =
                    contracts_1.CapacityDecision.ALERT;
                reason =
                    "Critical capacity threshold exceeded";
            }
        }
        else if (dto.actualValue >=
            policy.thresholds.scaleOut) {
            status =
                contracts_1.CapacityEvaluationStatus.WARNING;
            if (policy.allowAutomaticScaling &&
                dto.currentInstances <
                    policy.maximumInstances) {
                decision =
                    contracts_1.CapacityDecision.SCALE_OUT;
                recommendedInstances =
                    Math.min(policy.maximumInstances, dto.currentInstances +
                        policy.scaleStep);
                reason =
                    "Scale-out threshold exceeded";
            }
            else {
                decision =
                    contracts_1.CapacityDecision.ALERT;
                reason =
                    "Scale-out threshold exceeded";
            }
        }
        else if (policy.thresholds.scaleIn !==
            undefined &&
            dto.actualValue <=
                policy.thresholds.scaleIn &&
            dto.currentInstances >
                policy.minimumInstances) {
            decision =
                contracts_1.CapacityDecision.SCALE_IN;
            recommendedInstances =
                Math.max(policy.minimumInstances, dto.currentInstances -
                    policy.scaleStep);
            reason =
                "Scale-in threshold reached";
        }
        else if (dto.actualValue >=
            policy.thresholds.warning) {
            status =
                contracts_1.CapacityEvaluationStatus.WARNING;
            decision =
                contracts_1.CapacityDecision.ALERT;
            reason =
                "Warning capacity threshold exceeded";
        }
        const evaluation = {
            id: (0, crypto_1.randomUUID)(),
            policyId: policy.id,
            service: policy.service,
            metricType: policy.metricType,
            metricName: policy.metricName,
            actualValue: dto.actualValue,
            currentInstances: dto.currentInstances,
            status,
            decision,
            recommendedInstances,
            reason,
            metadata: (dto.metadata ?? {}),
            observedAt: dto.observedAt ??
                new Date().toISOString(),
            evaluatedAt: new Date().toISOString(),
        };
        policy.lastEvaluationAt =
            evaluation.evaluatedAt;
        if (decision !==
            contracts_1.CapacityDecision.NO_ACTION) {
            policy.lastActionAt =
                evaluation.evaluatedAt;
        }
        policy.updatedAt =
            evaluation.evaluatedAt;
        this.store.saveCapacityPolicy(policy);
        const saved = this.store.saveCapacityEvaluation(evaluation);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .SLO_EVALUATED,
            aggregateType: "runtime_capacity_evaluation",
            aggregateId: saved.id,
            actor: {
                id: "avos-capacity-governance",
                type: "system",
                name: "AVOS Capacity Governance",
                roles: [
                    "runtime_governance",
                    "capacity_management",
                ],
            },
            payload: {
                capacityEvaluationId: saved.id,
                policyId: saved.policyId,
                service: saved.service,
                actualValue: saved.actualValue,
                currentInstances: saved.currentInstances,
                status: saved.status,
                decision: saved.decision,
                recommendedInstances: saved.recommendedInstances,
            },
        });
        return saved;
    }
    listPolicies() {
        return this.store
            .listCapacityPolicies();
    }
    listEvaluations() {
        return this.store
            .listCapacityEvaluations();
    }
    get(id) {
        const policy = this.store.getCapacityPolicy(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Capacity policy ${id} was not found`);
        }
        return policy;
    }
};
exports.RuntimeCapacityGovernanceService = RuntimeCapacityGovernanceService;
exports.RuntimeCapacityGovernanceService = RuntimeCapacityGovernanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeCapacityGovernanceService);
//# sourceMappingURL=runtime-capacity-governance.service.js.map