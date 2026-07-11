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
exports.RuntimeRiskEvaluationService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_risk_util_1 = require("../utils/runtime-risk.util");
const runtime_evidence_chain_service_1 = require("./runtime-evidence-chain.service");
const resilience_policy_evaluator_service_1 = require("./resilience-policy-evaluator.service");
let RuntimeRiskEvaluationService = class RuntimeRiskEvaluationService {
    constructor(store, evidence, evaluator) {
        this.store = store;
        this.evidence = evidence;
        this.evaluator = evaluator;
    }
    evaluate(dto) {
        const policy = this.resolvePolicy(dto);
        const factors = this.buildRiskFactors(dto);
        const baseScore = (0, runtime_risk_util_1.clampScore)(factors.reduce((sum, factor) => sum + factor.weightedScore, 0));
        const context = {
            ...dto.context,
            environment: dto.environment,
            namespace: dto.namespace,
            changeType: dto.changeType,
            riskScore: baseScore,
        };
        const matchedRules = policy
            ? policy.rules.filter((rule) => rule.enabled &&
                this.evaluator.evaluateConditions(rule.conditions, context))
            : [];
        const highestPriorityRule = matchedRules
            .slice()
            .sort((a, b) => b.priority - a.priority)[0];
        const riskLevel = highestPriorityRule?.riskLevel ??
            policy?.defaultRiskLevel ??
            (0, runtime_risk_util_1.riskLevelFromScore)(baseScore);
        const decision = highestPriorityRule?.decision ??
            policy?.defaultDecision ??
            (0, runtime_risk_util_1.decisionFromRiskLevel)(riskLevel);
        const requiredApprovals = highestPriorityRule?.requiredApprovals ??
            (0, runtime_risk_util_1.requiredApprovalsFromRiskLevel)(riskLevel);
        const reasons = [
            ...factors.map((factor) => factor.reason),
            ...(highestPriorityRule
                ? [
                    `Matched policy rule: ${highestPriorityRule.name}`,
                ]
                : ["No explicit policy rule matched"]),
        ];
        const evaluation = {
            id: (0, crypto_1.randomUUID)(),
            configurationId: dto.configurationId,
            policyId: policy?.id,
            environment: dto.environment,
            namespace: dto.namespace,
            changeType: dto.changeType,
            riskScore: baseScore,
            riskLevel,
            decision,
            factors,
            matchedRuleIds: matchedRules.map((rule) => rule.id),
            requiredApprovals,
            reasons,
            evaluatedBy: dto.actor,
            evaluatedAt: new Date().toISOString(),
            context: dto.context,
        };
        const saved = this.store.saveRiskEvaluation(evaluation);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.RISK_EVALUATED,
            aggregateType: "runtime_risk_evaluation",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                evaluationId: saved.id,
                configurationId: saved.configurationId ?? null,
                policyId: saved.policyId ?? null,
                riskScore: saved.riskScore,
                riskLevel: saved.riskLevel,
                decision: saved.decision,
                requiredApprovals: saved.requiredApprovals,
                matchedRuleIds: saved.matchedRuleIds,
            },
        });
        return saved;
    }
    list() {
        return this.store.listRiskEvaluations();
    }
    get(id) {
        const evaluation = this.store.getRiskEvaluation(id);
        if (!evaluation) {
            throw new common_1.NotFoundException(`Runtime risk evaluation ${id} was not found`);
        }
        return evaluation;
    }
    resolvePolicy(dto) {
        if (dto.policyId) {
            const policy = this.store.getPolicy(dto.policyId);
            if (!policy) {
                throw new common_1.NotFoundException(`Resilience policy ${dto.policyId} was not found`);
            }
            return policy;
        }
        return this.store
            .listPolicies()
            .filter((policy) => policy.status === runtime_resilience_enums_1.ResiliencePolicyStatus.ACTIVE &&
            (!policy.environment ||
                policy.environment === dto.environment) &&
            (!policy.namespace ||
                policy.namespace === dto.namespace))
            .sort((a, b) => b.version - a.version)[0];
    }
    buildRiskFactors(dto) {
        const factors = [];
        factors.push(this.createFactor("environment", "Runtime environment", this.environmentScore(dto.environment), 0.2, `Environment ${dto.environment} contributes deployment risk`));
        factors.push(this.createFactor("change_type", "Change type", this.changeTypeScore(dto.changeType), 0.25, `Change type ${dto.changeType} contributes operational risk`));
        const context = dto.context;
        factors.push(this.createFactor("blast_radius", "Blast radius", this.numericContextScore(context.blastRadius, 0, 100, 30), 0.2, "Blast radius was evaluated from runtime context"));
        factors.push(this.createFactor("rollback_readiness", "Rollback readiness", this.booleanInverseScore(context.rollbackReady, 15, 85), 0.15, "Rollback readiness influences recovery risk"));
        factors.push(this.createFactor("test_coverage", "Test coverage", this.inversePercentageScore(context.testCoverage, 50), 0.1, "Test coverage influences regression risk"));
        factors.push(this.createFactor("active_incidents", "Active incidents", this.activeIncidentScore(context.activeIncidents), 0.1, "Existing active incidents increase change risk"));
        return factors;
    }
    createFactor(key, label, score, weight, reason) {
        const normalizedScore = (0, runtime_risk_util_1.clampScore)(score);
        return {
            key,
            label,
            score: normalizedScore,
            weight,
            weightedScore: Math.round(normalizedScore * weight),
            reason,
        };
    }
    environmentScore(environment) {
        switch (environment) {
            case runtime_resilience_enums_1.RuntimeEnvironment.PRODUCTION:
                return 90;
            case runtime_resilience_enums_1.RuntimeEnvironment.STAGING:
                return 55;
            case runtime_resilience_enums_1.RuntimeEnvironment.TEST:
                return 25;
            case runtime_resilience_enums_1.RuntimeEnvironment.DEVELOPMENT:
            default:
                return 10;
        }
    }
    changeTypeScore(changeType) {
        switch (changeType) {
            case runtime_resilience_enums_1.RuntimeChangeType.EMERGENCY:
                return 100;
            case runtime_resilience_enums_1.RuntimeChangeType.SECURITY:
                return 90;
            case runtime_resilience_enums_1.RuntimeChangeType.DATABASE:
                return 85;
            case runtime_resilience_enums_1.RuntimeChangeType.INFRASTRUCTURE:
                return 80;
            case runtime_resilience_enums_1.RuntimeChangeType.DEPLOYMENT:
                return 70;
            case runtime_resilience_enums_1.RuntimeChangeType.INTEGRATION:
                return 65;
            case runtime_resilience_enums_1.RuntimeChangeType.POLICY:
                return 60;
            case runtime_resilience_enums_1.RuntimeChangeType.CONFIGURATION:
                return 45;
            case runtime_resilience_enums_1.RuntimeChangeType.FEATURE_FLAG:
            default:
                return 30;
        }
    }
    numericContextScore(value, minimum, maximum, fallback) {
        const numberValue = Number(value);
        if (!Number.isFinite(numberValue)) {
            return fallback;
        }
        if (numberValue <= minimum) {
            return 0;
        }
        if (numberValue >= maximum) {
            return 100;
        }
        return (((numberValue - minimum) / (maximum - minimum)) * 100);
    }
    booleanInverseScore(value, trueScore, falseScore) {
        if (value === true) {
            return trueScore;
        }
        if (value === false) {
            return falseScore;
        }
        return Math.round((trueScore + falseScore) / 2);
    }
    inversePercentageScore(value, fallback) {
        const percentage = Number(value);
        if (!Number.isFinite(percentage)) {
            return fallback;
        }
        return (0, runtime_risk_util_1.clampScore)(100 - percentage);
    }
    activeIncidentScore(value) {
        const count = Number(value);
        if (!Number.isFinite(count) || count <= 0) {
            return 0;
        }
        if (count >= 5) {
            return 100;
        }
        return count * 20;
    }
};
exports.RuntimeRiskEvaluationService = RuntimeRiskEvaluationService;
exports.RuntimeRiskEvaluationService = RuntimeRiskEvaluationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService,
        resilience_policy_evaluator_service_1.ResiliencePolicyEvaluatorService])
], RuntimeRiskEvaluationService);
//# sourceMappingURL=runtime-risk-evaluation.service.js.map