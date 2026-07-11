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
exports.RuntimeAutonomousApprovalService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_approval_matrix_service_1 = require("./runtime-governance-approval-matrix.service");
const runtime_operational_guardrail_service_1 = require("./runtime-operational-guardrail.service");
let RuntimeAutonomousApprovalService = class RuntimeAutonomousApprovalService {
    constructor(store, matrix, guardrails) {
        this.store = store;
        this.matrix = matrix;
        this.guardrails = guardrails;
    }
    generate(request, runtimeContext = {}) {
        const matrixDecision = this.matrix.evaluate(request);
        const guardrailEvaluations = this.guardrails
            .evaluateRequest(request, runtimeContext);
        const blockingConditions = guardrailEvaluations
            .filter((item) => item.result ===
            contracts_1.GuardrailEvaluationResult.FAILED)
            .flatMap((item) => item.reasons);
        const warningConditions = guardrailEvaluations
            .filter((item) => item.result ===
            contracts_1.GuardrailEvaluationResult.WARNING)
            .flatMap((item) => item.reasons);
        let decision = contracts_1.ApprovalSuggestionDecision
            .REQUIRE_MANUAL_REVIEW;
        let confidenceScore = 70;
        const risk = request.evaluatedRiskLevel ??
            request.requestedRiskLevel;
        if (blockingConditions.length > 0 ||
            request.decision ===
                contracts_1.GovernanceDecision.BLOCK) {
            decision =
                risk ===
                    contracts_1.GovernanceRiskLevel.CRITICAL
                    ? contracts_1.ApprovalSuggestionDecision
                        .AUTO_REJECT
                    : contracts_1.ApprovalSuggestionDecision
                        .RECOMMEND_REJECTION;
            confidenceScore =
                95;
        }
        else if (request.decision ===
            contracts_1.GovernanceDecision.DEFER) {
            decision =
                contracts_1.ApprovalSuggestionDecision.DEFER;
            confidenceScore =
                92;
        }
        else if (risk ===
            contracts_1.GovernanceRiskLevel.INFORMATIONAL &&
            request.rollbackPlanAvailable &&
            (request.testCoverage ??
                0) >= 90 &&
            warningConditions.length === 0 &&
            matrixDecision.tier ===
                contracts_1.GovernanceApprovalTier.NONE) {
            decision =
                contracts_1.ApprovalSuggestionDecision
                    .AUTO_APPROVE;
            confidenceScore =
                97;
        }
        else if ((risk ===
            contracts_1.GovernanceRiskLevel.LOW ||
            risk ===
                contracts_1.GovernanceRiskLevel.MEDIUM) &&
            request.rollbackPlanAvailable &&
            (request.testCoverage ??
                0) >= 75 &&
            blockingConditions.length === 0) {
            decision =
                contracts_1.ApprovalSuggestionDecision
                    .RECOMMEND_APPROVAL;
            confidenceScore =
                warningConditions.length > 0
                    ? 82
                    : 91;
        }
        else {
            decision =
                contracts_1.ApprovalSuggestionDecision
                    .REQUIRE_MANUAL_REVIEW;
            confidenceScore =
                85;
        }
        const confidence = this.confidenceFromScore(confidenceScore);
        const suggestion = {
            id: (0, crypto_1.randomUUID)(),
            requestId: request.id,
            decision,
            confidence,
            confidenceScore,
            suggestedApprovalCount: Math.max(request.approvalsRequired, matrixDecision
                .requiredApprovals),
            suggestedRoles: Array.from(new Set(matrixDecision.requiredRoles)),
            reasons: [
                ...matrixDecision.reasons,
                `Risk level: ${risk}`,
                `Decision recommendation: ${decision}`,
            ],
            blockingConditions,
            warningConditions,
            metadata: {
                matrixTier: matrixDecision.tier,
                matchedRuleIds: matrixDecision.matchedRuleIds,
                guardrailEvaluations: guardrailEvaluations.length,
            },
            generatedAt: new Date().toISOString(),
        };
        return this.store
            .saveApprovalSuggestion(suggestion);
    }
    list() {
        return this.store
            .listApprovalSuggestions();
    }
    confidenceFromScore(score) {
        if (score >= 95) {
            return contracts_1.RuntimeDecisionConfidence
                .VERY_HIGH;
        }
        if (score >= 80) {
            return contracts_1.RuntimeDecisionConfidence
                .HIGH;
        }
        if (score >= 60) {
            return contracts_1.RuntimeDecisionConfidence
                .MEDIUM;
        }
        return contracts_1.RuntimeDecisionConfidence
            .LOW;
    }
};
exports.RuntimeAutonomousApprovalService = RuntimeAutonomousApprovalService;
exports.RuntimeAutonomousApprovalService = RuntimeAutonomousApprovalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_approval_matrix_service_1.RuntimeGovernanceApprovalMatrixService,
        runtime_operational_guardrail_service_1.RuntimeOperationalGuardrailService])
], RuntimeAutonomousApprovalService);
//# sourceMappingURL=runtime-autonomous-approval.service.js.map