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
exports.RuntimeGovernanceEvaluationService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
const runtime_change_window_service_1 = require("./runtime-change-window.service");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
const runtime_governance_recommendation_service_1 = require("./runtime-governance-recommendation.service");
const runtime_governance_request_service_1 = require("./runtime-governance-request.service");
const runtime_maintenance_mode_service_1 = require("./runtime-maintenance-mode.service");
let RuntimeGovernanceEvaluationService = class RuntimeGovernanceEvaluationService {
    constructor(store, requests, changeWindows, maintenance, recommendations, audit) {
        this.store = store;
        this.requests = requests;
        this.changeWindows = changeWindows;
        this.maintenance = maintenance;
        this.recommendations = recommendations;
        this.audit = audit;
    }
    evaluate(id, dto) {
        const request = this.requests.get(id);
        if (![
            contracts_1.GovernanceRequestStatus.PENDING,
            contracts_1.GovernanceRequestStatus.DEFERRED,
        ].includes(request.status)) {
            throw new common_1.BadRequestException(`Request cannot be evaluated in status ${request.status}`);
        }
        request.status =
            contracts_1.GovernanceRequestStatus.EVALUATING;
        request.updatedAt =
            new Date().toISOString();
        this.store
            .saveGovernanceRequest(request);
        const factors = this.buildFactors(request, dto.runtimeContext ?? {});
        const riskScore = (0, utils_1.clampGovernanceScore)(factors.reduce((total, factor) => total +
            factor.weightedScore, 0));
        let riskLevel = (0, utils_1.governanceRiskFromScore)(riskScore);
        let decision = (0, utils_1.governanceDecisionFromRisk)(riskLevel);
        if (this.store.getControlMode() ===
            contracts_1.GovernanceControlMode.LOCKDOWN) {
            riskLevel =
                contracts_1.GovernanceRiskLevel.CRITICAL;
            decision =
                contracts_1.GovernanceDecision.BLOCK;
        }
        if (request.changeWindowId) {
            const windowDecision = this.changeWindows
                .isRequestAllowed(request.changeWindowId, request.type, riskLevel);
            if (!windowDecision.allowed) {
                decision =
                    contracts_1.GovernanceDecision.DEFER;
            }
        }
        else if (request.environment ===
            "production") {
            decision =
                contracts_1.GovernanceDecision.DEFER;
        }
        const maintenancePolicy = this.maintenance
            .getAccessPolicy(request.environment, request.namespace, request.service);
        if (request.type ===
            "deployment" &&
            !maintenancePolicy
                .allowDeployments) {
            decision =
                contracts_1.GovernanceDecision.BLOCK;
        }
        const generatedRecommendations = this.recommendations
            .generate(request);
        request.evaluatedRiskLevel =
            riskLevel;
        request.riskScore =
            riskScore;
        request.decision =
            decision;
        request.evaluationFactors =
            factors;
        request.recommendations =
            generatedRecommendations;
        request.approvalsRequired =
            Math.max(request.approvalsRequired, (0, utils_1.approvalsFromGovernanceRisk)(riskLevel));
        request.evaluatedAt =
            new Date().toISOString();
        request.updatedAt =
            request.evaluatedAt;
        if (decision ===
            contracts_1.GovernanceDecision.BLOCK) {
            request.status =
                contracts_1.GovernanceRequestStatus.REJECTED;
            request.rejectedAt =
                request.evaluatedAt;
        }
        else if (decision ===
            contracts_1.GovernanceDecision.DEFER) {
            request.status =
                contracts_1.GovernanceRequestStatus.DEFERRED;
        }
        else if (request.approvalsRequired === 0) {
            request.status =
                contracts_1.GovernanceRequestStatus.APPROVED;
            request.approvedAt =
                request.evaluatedAt;
        }
        else {
            request.status =
                contracts_1.GovernanceRequestStatus.PENDING;
        }
        const saved = this.store
            .saveGovernanceRequest(request);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .GOVERNANCE_REQUEST_EVALUATED,
            aggregateType: "governance_request",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                requestId: saved.id,
                riskScore: saved.riskScore ?? 0,
                evaluatedRiskLevel: saved.evaluatedRiskLevel ??
                    null,
                decision: saved.decision ??
                    null,
                status: saved.status,
                approvalsRequired: saved.approvalsRequired,
                recommendationIds: saved.recommendations.map((item) => item.id),
            },
        });
        return saved;
    }
    buildFactors(request, runtimeContext) {
        const factors = [];
        factors.push(this.factor("requested_risk", "Requested risk level", this.riskLevelScore(request.requestedRiskLevel), 0.2, `Requested risk level is ${request.requestedRiskLevel}`));
        factors.push(this.factor("blast_radius", "Blast radius", request.blastRadius ??
            Number(runtimeContext
                .blastRadius ??
                30), 0.2, "Blast radius influences runtime change risk"));
        factors.push(this.factor("business_criticality", "Business criticality", request.businessCriticality ??
            Number(runtimeContext
                .businessCriticality ??
                40), 0.15, "Business criticality increases governance requirements"));
        factors.push(this.factor("test_coverage", "Test coverage", 100 -
            (request.testCoverage ??
                Number(runtimeContext
                    .testCoverage ??
                    50)), 0.15, "Lower test coverage increases deployment risk"));
        factors.push(this.factor("rollback_readiness", "Rollback readiness", request.rollbackPlanAvailable
            ? 10
            : 90, 0.15, request.rollbackPlanAvailable
            ? "Rollback plan is available"
            : "Rollback plan is missing"));
        factors.push(this.factor("production_environment", "Production environment", request.environment ===
            "production"
            ? 85
            : 25, 0.1, `Request environment is ${request.environment}`));
        factors.push(this.factor("active_incidents", "Active incident pressure", Math.min(100, Number(runtimeContext
            .activeIncidents ??
            0) *
            20), 0.05, "Active incidents increase operational change risk"));
        return factors;
    }
    factor(key, label, score, weight, reason) {
        const normalized = (0, utils_1.clampGovernanceScore)(score);
        return {
            key,
            label,
            score: normalized,
            weight,
            weightedScore: Math.round(normalized *
                weight),
            reason,
            metadata: {},
        };
    }
    riskLevelScore(level) {
        switch (level) {
            case contracts_1.GovernanceRiskLevel.CRITICAL:
                return 100;
            case contracts_1.GovernanceRiskLevel.HIGH:
                return 80;
            case contracts_1.GovernanceRiskLevel.MEDIUM:
                return 55;
            case contracts_1.GovernanceRiskLevel.LOW:
                return 25;
            case contracts_1.GovernanceRiskLevel.INFORMATIONAL:
            default:
                return 5;
        }
    }
};
exports.RuntimeGovernanceEvaluationService = RuntimeGovernanceEvaluationService;
exports.RuntimeGovernanceEvaluationService = RuntimeGovernanceEvaluationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_request_service_1.RuntimeGovernanceRequestService,
        runtime_change_window_service_1.RuntimeChangeWindowService,
        runtime_maintenance_mode_service_1.RuntimeMaintenanceModeService,
        runtime_governance_recommendation_service_1.RuntimeGovernanceRecommendationService,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeGovernanceEvaluationService);
//# sourceMappingURL=runtime-governance-evaluation.service.js.map