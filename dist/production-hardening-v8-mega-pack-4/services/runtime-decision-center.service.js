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
exports.RuntimeDecisionCenterService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_autonomous_approval_service_1 = require("./runtime-autonomous-approval.service");
const runtime_governance_approval_matrix_service_1 = require("./runtime-governance-approval-matrix.service");
const runtime_governance_request_service_1 = require("./runtime-governance-request.service");
const runtime_operational_guardrail_service_1 = require("./runtime-operational-guardrail.service");
let RuntimeDecisionCenterService = class RuntimeDecisionCenterService {
    constructor(store, requests, matrix, approvals, guardrails) {
        this.store = store;
        this.requests = requests;
        this.matrix = matrix;
        this.approvals = approvals;
        this.guardrails = guardrails;
    }
    generate(requestId, runtimeContext = {}) {
        const request = this.requests.get(requestId);
        const matrixDecision = this.matrix.evaluate(request);
        const suggestion = this.approvals.generate(request, runtimeContext);
        const guardrailEvaluations = this.store
            .listGuardrailEvaluations()
            .filter((item) => item.requestId ===
            request.id);
        const failedGuardrails = guardrailEvaluations.filter((item) => item.result ===
            contracts_1.GuardrailEvaluationResult.FAILED);
        const warningGuardrails = guardrailEvaluations.filter((item) => item.result ===
            contracts_1.GuardrailEvaluationResult.WARNING);
        let decision = request.decision ??
            contracts_1.GovernanceDecision
                .REQUIRE_APPROVAL;
        if (failedGuardrails.length > 0) {
            decision =
                failedGuardrails[0]
                    .decision ??
                    contracts_1.GovernanceDecision.BLOCK;
        }
        const confidenceScore = Math.min(100, Math.max(0, suggestion.confidenceScore -
            warningGuardrails.length * 5));
        const evidence = [
            {
                id: (0, crypto_1.randomUUID)(),
                source: contracts_1.RuntimeDecisionSource
                    .RISK_ENGINE,
                sourceId: request.id,
                label: "Governance risk score",
                value: request.riskScore ?? 0,
                weight: 0.3,
                score: request.riskScore ?? 0,
                reason: "Governance request risk evaluation",
                metadata: {},
            },
            {
                id: (0, crypto_1.randomUUID)(),
                source: contracts_1.RuntimeDecisionSource
                    .APPROVAL_MATRIX,
                sourceId: request.id,
                label: "Approval tier",
                value: matrixDecision.tier,
                weight: 0.2,
                score: matrixDecision
                    .requiredApprovals *
                    20,
                reason: matrixDecision.reasons.join("; "),
                metadata: {
                    matchedRuleIds: matrixDecision
                        .matchedRuleIds,
                },
            },
            {
                id: (0, crypto_1.randomUUID)(),
                source: contracts_1.RuntimeDecisionSource
                    .POLICY,
                sourceId: request.id,
                label: "Operational guardrails",
                value: failedGuardrails.length,
                weight: 0.3,
                score: failedGuardrails.length *
                    30 +
                    warningGuardrails.length *
                        10,
                reason: `Failed guardrails: ${failedGuardrails.length}; warning guardrails: ${warningGuardrails.length}`,
                metadata: {
                    failedGuardrailIds: failedGuardrails.map((item) => item.guardrailId),
                    warningGuardrailIds: warningGuardrails.map((item) => item.guardrailId),
                },
            },
            {
                id: (0, crypto_1.randomUUID)(),
                source: contracts_1.RuntimeDecisionSource
                    .COMPOSITE,
                sourceId: suggestion.id,
                label: "Autonomous approval suggestion",
                value: suggestion.decision,
                weight: 0.2,
                score: suggestion.confidenceScore,
                reason: suggestion.reasons.join("; "),
                metadata: {
                    blockingConditions: suggestion
                        .blockingConditions,
                    warningConditions: suggestion
                        .warningConditions,
                },
            },
        ];
        const now = new Date().toISOString();
        const record = {
            id: (0, crypto_1.randomUUID)(),
            requestId: request.id,
            status: contracts_1.RuntimeDecisionRecordStatus
                .PENDING_REVIEW,
            decision,
            source: contracts_1.RuntimeDecisionSource
                .COMPOSITE,
            confidence: this.confidenceFromScore(confidenceScore),
            confidenceScore,
            riskLevel: request.evaluatedRiskLevel ??
                request.requestedRiskLevel,
            riskScore: request.riskScore ?? 0,
            approvalTier: matrixDecision.tier,
            approvalsRequired: Math.max(request.approvalsRequired, matrixDecision
                .requiredApprovals, suggestion
                .suggestedApprovalCount),
            requiredRoles: Array.from(new Set([
                ...matrixDecision
                    .requiredRoles,
                ...suggestion
                    .suggestedRoles,
            ])),
            evidence,
            reasons: [
                ...(request
                    .recommendations ?? [])
                    .map((item) => item.description),
                ...suggestion.reasons,
            ],
            recommendations: [
                ...(request.recommendations ??
                    []).map((item) => item.title),
                ...suggestion
                    .warningConditions,
            ],
            expiresAt: new Date(Date.now() +
                24 * 60 * 60 * 1000).toISOString(),
            createdBy: {
                id: "avos-runtime-decision-center",
                type: "system",
                name: "AVOS Runtime Decision Center",
                roles: [
                    "runtime_governance",
                    "decision_authority",
                ],
            },
            createdAt: now,
            updatedAt: now,
        };
        return this.store
            .saveDecisionRecord(record);
    }
    list() {
        return this.store
            .listDecisionRecords();
    }
    get(id) {
        const record = this.store
            .getDecisionRecord(id);
        if (!record) {
            throw new common_1.NotFoundException(`Runtime decision record ${id} was not found`);
        }
        return record;
    }
    review(id, dto) {
        const record = this.get(id);
        if (![
            contracts_1.RuntimeDecisionRecordStatus.PENDING_REVIEW,
            contracts_1.RuntimeDecisionRecordStatus.GENERATED,
        ].includes(record.status)) {
            throw new common_1.BadRequestException(`Decision cannot be reviewed in status ${record.status}`);
        }
        const now = new Date().toISOString();
        record.status =
            dto.status;
        record.reviewedBy =
            dto.actor;
        record.reviewedAt =
            now;
        record.updatedAt =
            now;
        if (dto.status ===
            contracts_1.RuntimeDecisionRecordStatus.ACCEPTED) {
            record.acceptedAt =
                now;
        }
        if (dto.status ===
            contracts_1.RuntimeDecisionRecordStatus.REJECTED) {
            record.rejectedAt =
                now;
        }
        if (dto.status ===
            contracts_1.RuntimeDecisionRecordStatus.OVERRIDDEN) {
            record.overriddenAt =
                now;
            record.overrideReason =
                dto.overrideReason ??
                    dto.reason;
        }
        record.reasons.push(`Review: ${dto.reason}`);
        return this.store
            .saveDecisionRecord(record);
    }
    markExecuted(id) {
        const record = this.get(id);
        if (record.status !==
            contracts_1.RuntimeDecisionRecordStatus.ACCEPTED) {
            throw new common_1.BadRequestException(`Only accepted decisions can be marked executed. Current status: ${record.status}`);
        }
        record.status =
            contracts_1.RuntimeDecisionRecordStatus.EXECUTED;
        record.executedAt =
            new Date().toISOString();
        record.updatedAt =
            record.executedAt;
        const request = this.requests.get(record.requestId);
        if (request.status ===
            contracts_1.GovernanceRequestStatus.APPROVED) {
            request.status =
                contracts_1.GovernanceRequestStatus.EXECUTED;
            request.executedAt =
                record.executedAt;
            request.updatedAt =
                record.executedAt;
            this.store
                .saveGovernanceRequest(request);
        }
        return this.store
            .saveDecisionRecord(record);
    }
    snapshot() {
        const decisions = this.list();
        const evaluations = this.guardrails
            .listEvaluations();
        return {
            totalDecisions: decisions.length,
            generatedDecisions: decisions.filter((item) => item.status ===
                contracts_1.RuntimeDecisionRecordStatus.GENERATED).length,
            pendingReview: decisions.filter((item) => item.status ===
                contracts_1.RuntimeDecisionRecordStatus.PENDING_REVIEW).length,
            acceptedDecisions: decisions.filter((item) => item.status ===
                contracts_1.RuntimeDecisionRecordStatus.ACCEPTED).length,
            rejectedDecisions: decisions.filter((item) => item.status ===
                contracts_1.RuntimeDecisionRecordStatus.REJECTED).length,
            overriddenDecisions: decisions.filter((item) => item.status ===
                contracts_1.RuntimeDecisionRecordStatus.OVERRIDDEN).length,
            executedDecisions: decisions.filter((item) => item.status ===
                contracts_1.RuntimeDecisionRecordStatus.EXECUTED).length,
            approvalSuggestions: this.store
                .listApprovalSuggestions()
                .length,
            activeGuardrails: this.store
                .listGuardrails()
                .filter((item) => item.status ===
                "active").length,
            guardrailEvaluations: evaluations.length,
            failedGuardrails: evaluations.filter((item) => item.result ===
                contracts_1.GuardrailEvaluationResult.FAILED).length,
            warningGuardrails: evaluations.filter((item) => item.result ===
                contracts_1.GuardrailEvaluationResult.WARNING).length,
            generatedAt: new Date().toISOString(),
        };
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
exports.RuntimeDecisionCenterService = RuntimeDecisionCenterService;
exports.RuntimeDecisionCenterService = RuntimeDecisionCenterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_request_service_1.RuntimeGovernanceRequestService,
        runtime_governance_approval_matrix_service_1.RuntimeGovernanceApprovalMatrixService,
        runtime_autonomous_approval_service_1.RuntimeAutonomousApprovalService,
        runtime_operational_guardrail_service_1.RuntimeOperationalGuardrailService])
], RuntimeDecisionCenterService);
//# sourceMappingURL=runtime-decision-center.service.js.map