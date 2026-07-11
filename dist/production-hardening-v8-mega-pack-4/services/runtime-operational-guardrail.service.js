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
exports.RuntimeOperationalGuardrailService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_guardrail_evaluator_service_1 = require("./runtime-guardrail-evaluator.service");
let RuntimeOperationalGuardrailService = class RuntimeOperationalGuardrailService {
    constructor(store, evaluator) {
        this.store = store;
        this.evaluator = evaluator;
    }
    create(dto) {
        const duplicate = this.store
            .listGuardrails()
            .find((item) => item.key === dto.key &&
            item.status !==
                contracts_1.GuardrailStatus.ARCHIVED);
        if (duplicate) {
            throw new common_1.BadRequestException(`Guardrail already exists for key ${dto.key}`);
        }
        const now = new Date().toISOString();
        const guardrail = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            type: dto.type,
            status: contracts_1.GuardrailStatus.ACTIVE,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            requestTypes: dto.requestTypes,
            conditions: dto.conditions.map((condition) => ({
                field: condition.field,
                operator: condition.operator,
                value: condition.value,
            })),
            failureDecision: dto.failureDecision,
            warningOnly: dto.warningOnly,
            priority: dto.priority,
            requiredRoles: dto.requiredRoles,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
            activatedAt: now,
        };
        return this.store
            .saveGuardrail(guardrail);
    }
    list() {
        return this.store
            .listGuardrails();
    }
    get(id) {
        const guardrail = this.store.getGuardrail(id);
        if (!guardrail) {
            throw new common_1.NotFoundException(`Runtime guardrail ${id} was not found`);
        }
        return guardrail;
    }
    updateStatus(id, dto) {
        const guardrail = this.get(id);
        const now = new Date().toISOString();
        guardrail.status =
            dto.status;
        guardrail.updatedAt =
            now;
        if (dto.status ===
            contracts_1.GuardrailStatus.ACTIVE) {
            guardrail.activatedAt =
                now;
        }
        if (dto.status ===
            contracts_1.GuardrailStatus.DISABLED) {
            guardrail.disabledAt =
                now;
        }
        if (dto.status ===
            contracts_1.GuardrailStatus.ARCHIVED) {
            guardrail.archivedAt =
                now;
        }
        guardrail.metadata = {
            ...guardrail.metadata,
            lastStatusReason: dto.reason,
            lastStatusActorId: dto.actor.id,
        };
        return this.store
            .saveGuardrail(guardrail);
    }
    evaluateRequest(request, context) {
        const guardrails = this.list()
            .filter((guardrail) => guardrail.status ===
            contracts_1.GuardrailStatus.ACTIVE &&
            (!guardrail.environment ||
                guardrail.environment ===
                    request.environment) &&
            (!guardrail.namespace ||
                guardrail.namespace ===
                    request.namespace) &&
            (!guardrail.service ||
                guardrail.service ===
                    request.service) &&
            (guardrail.requestTypes
                .length === 0 ||
                guardrail.requestTypes
                    .includes(request.type)))
            .sort((a, b) => b.priority - a.priority);
        const evaluationContext = {
            request,
            context,
            riskLevel: request.evaluatedRiskLevel ??
                request.requestedRiskLevel,
            riskScore: request.riskScore ?? 0,
            blastRadius: request.blastRadius ?? 0,
            testCoverage: request.testCoverage ?? 0,
            rollbackPlanAvailable: request.rollbackPlanAvailable,
            businessCriticality: request.businessCriticality ??
                0,
            environment: request.environment,
            namespace: request.namespace,
            service: request.service ?? null,
            requestType: request.type,
            approvalsRequired: request.approvalsRequired,
        };
        return guardrails.map((guardrail) => {
            const matched = this.evaluator
                .evaluateConditions(guardrail.conditions, evaluationContext);
            const result = matched
                ? guardrail.warningOnly
                    ? contracts_1.GuardrailEvaluationResult.WARNING
                    : contracts_1.GuardrailEvaluationResult.FAILED
                : contracts_1.GuardrailEvaluationResult.PASSED;
            const reasons = matched
                ? [
                    `Guardrail matched: ${guardrail.name}`,
                ]
                : [
                    `Guardrail passed: ${guardrail.name}`,
                ];
            const evaluation = {
                id: (0, crypto_1.randomUUID)(),
                guardrailId: guardrail.id,
                requestId: request.id,
                result,
                decision: matched
                    ? guardrail.failureDecision
                    : undefined,
                reasons,
                evaluatedValues: {
                    riskLevel: String(evaluationContext.riskLevel),
                    riskScore: evaluationContext.riskScore,
                    blastRadius: evaluationContext.blastRadius,
                    testCoverage: evaluationContext.testCoverage,
                    rollbackPlanAvailable: evaluationContext
                        .rollbackPlanAvailable,
                    approvalsRequired: evaluationContext
                        .approvalsRequired,
                },
                evaluatedAt: new Date().toISOString(),
            };
            return this.store
                .saveGuardrailEvaluation(evaluation);
        });
    }
    listEvaluations() {
        return this.store
            .listGuardrailEvaluations();
    }
};
exports.RuntimeOperationalGuardrailService = RuntimeOperationalGuardrailService;
exports.RuntimeOperationalGuardrailService = RuntimeOperationalGuardrailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_guardrail_evaluator_service_1.RuntimeGuardrailEvaluatorService])
], RuntimeOperationalGuardrailService);
//# sourceMappingURL=runtime-operational-guardrail.service.js.map