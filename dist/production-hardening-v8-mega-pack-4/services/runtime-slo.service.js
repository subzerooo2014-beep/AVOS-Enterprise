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
exports.RuntimeSloService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeSloService = class RuntimeSloService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    create(dto) {
        const duplicate = this.store
            .listSloDefinitions()
            .find((slo) => slo.key === dto.key &&
            slo.environment ===
                dto.environment &&
            slo.namespace ===
                dto.namespace &&
            slo.service ===
                dto.service);
        if (duplicate) {
            throw new common_1.BadRequestException(`Runtime SLO already exists for key ${dto.key}`);
        }
        const now = new Date().toISOString();
        const item = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            metric: dto.metric,
            target: dto.target,
            warningThreshold: dto.warningThreshold,
            breachThreshold: dto.breachThreshold,
            evaluationWindowMinutes: dto.evaluationWindowMinutes,
            enabled: dto.enabled,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store
            .saveSloDefinition(item);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .SLO_REGISTERED,
            aggregateType: "runtime_slo_definition",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                sloId: saved.id,
                key: saved.key,
                environment: saved.environment,
                namespace: saved.namespace,
                service: saved.service,
                metric: saved.metric,
                target: saved.target,
                warningThreshold: saved.warningThreshold,
                breachThreshold: saved.breachThreshold,
                enabled: saved.enabled,
            },
        });
        return saved;
    }
    evaluate(id, dto) {
        const slo = this.get(id);
        if (!slo.enabled) {
            throw new common_1.BadRequestException("Runtime SLO is disabled");
        }
        const status = this.resolveComplianceStatus(slo, dto.actualValue);
        const breachPercentage = this.calculateBreachPercentage(slo.target, dto.actualValue);
        const errorBudgetRemaining = (0, utils_1.clampGovernanceScore)(100 -
            breachPercentage);
        const item = {
            id: (0, crypto_1.randomUUID)(),
            sloId: slo.id,
            actualValue: dto.actualValue,
            targetValue: slo.target,
            complianceStatus: status,
            errorBudgetRemaining,
            breachPercentage,
            observedAt: dto.observedAt ??
                new Date().toISOString(),
            evaluatedAt: new Date().toISOString(),
            metadata: (dto.metadata ?? {}),
        };
        const saved = this.store
            .saveSloEvaluation(item);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .SLO_EVALUATED,
            aggregateType: "runtime_slo_evaluation",
            aggregateId: saved.id,
            actor: {
                id: "avos-slo-engine",
                type: "system",
                name: "AVOS Runtime SLO Engine",
                roles: [
                    "runtime_governance",
                    "slo_enforcement",
                ],
            },
            payload: {
                evaluationId: saved.id,
                sloId: saved.sloId,
                actualValue: saved.actualValue,
                targetValue: saved.targetValue,
                complianceStatus: saved.complianceStatus,
                errorBudgetRemaining: saved.errorBudgetRemaining,
                breachPercentage: saved.breachPercentage,
                observedAt: saved.observedAt,
            },
        });
        return saved;
    }
    listDefinitions() {
        return this.store
            .listSloDefinitions();
    }
    listEvaluations() {
        return this.store
            .listSloEvaluations();
    }
    get(id) {
        const item = this.store
            .getSloDefinition(id);
        if (!item) {
            throw new common_1.NotFoundException(`Runtime SLO ${id} was not found`);
        }
        return item;
    }
    getServiceCompliance(environment, namespace, service) {
        const definitions = this.listDefinitions()
            .filter((slo) => slo.environment ===
            environment &&
            slo.namespace ===
                namespace &&
            slo.service ===
                service &&
            slo.enabled);
        const latestEvaluations = definitions
            .map((definition) => {
            const evaluation = this.listEvaluations()
                .filter((item) => item.sloId ===
                definition.id)
                .sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt))[0];
            return {
                definition,
                evaluation,
            };
        });
        const compliant = latestEvaluations.filter((item) => item.evaluation?.complianceStatus ===
            contracts_1.SloComplianceStatus.COMPLIANT).length;
        const atRisk = latestEvaluations.filter((item) => item.evaluation?.complianceStatus ===
            contracts_1.SloComplianceStatus.AT_RISK).length;
        const breached = latestEvaluations.filter((item) => item.evaluation?.complianceStatus ===
            contracts_1.SloComplianceStatus.BREACHED).length;
        const unknown = latestEvaluations.filter((item) => !item.evaluation ||
            item.evaluation.complianceStatus ===
                contracts_1.SloComplianceStatus.UNKNOWN).length;
        const evaluatedCount = compliant +
            atRisk +
            breached;
        const compliancePercentage = evaluatedCount === 0
            ? 0
            : Math.round(compliant /
                evaluatedCount *
                100);
        return {
            environment,
            namespace,
            service,
            definitions: definitions.length,
            compliant,
            atRisk,
            breached,
            unknown,
            compliancePercentage,
            evaluatedAt: new Date().toISOString(),
        };
    }
    resolveComplianceStatus(slo, actualValue) {
        const higherIsBetter = slo.target >=
            slo.breachThreshold;
        if (higherIsBetter) {
            if (actualValue >=
                slo.target) {
                return contracts_1.SloComplianceStatus.COMPLIANT;
            }
            if (actualValue >=
                slo.warningThreshold) {
                return contracts_1.SloComplianceStatus.AT_RISK;
            }
            return contracts_1.SloComplianceStatus.BREACHED;
        }
        if (actualValue <=
            slo.target) {
            return contracts_1.SloComplianceStatus.COMPLIANT;
        }
        if (actualValue <=
            slo.warningThreshold) {
            return contracts_1.SloComplianceStatus.AT_RISK;
        }
        return contracts_1.SloComplianceStatus.BREACHED;
    }
    calculateBreachPercentage(target, actual) {
        if (target === 0) {
            return actual === 0
                ? 0
                : 100;
        }
        return (0, utils_1.clampGovernanceScore)(Math.abs(actual - target) /
            Math.abs(target) *
            100);
    }
};
exports.RuntimeSloService = RuntimeSloService;
exports.RuntimeSloService = RuntimeSloService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeSloService);
//# sourceMappingURL=runtime-slo.service.js.map