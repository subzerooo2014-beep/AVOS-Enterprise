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
exports.RuntimeGovernanceRecommendationService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeGovernanceRecommendationService = class RuntimeGovernanceRecommendationService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    generate(request) {
        const recommendations = [];
        if (!request.rollbackPlanAvailable) {
            recommendations.push(this.create(request, contracts_1.GovernanceRecommendationType
                .REQUIRE_ROLLBACK_PLAN, 100, "Rollback plan required", "The request must include a validated rollback plan before approval.", true, 99, {
                reason: "rollback_plan_missing",
            }));
        }
        if ((request.testCoverage ??
            0) < 75) {
            recommendations.push(this.create(request, contracts_1.GovernanceRecommendationType
                .REQUIRE_TESTING, 90, "Additional testing required", "Test coverage is below the governance threshold of 75%.", true, 95, {
                testCoverage: request.testCoverage ??
                    0,
                minimumRequired: 75,
            }));
        }
        if ((request.blastRadius ??
            0) >= 60) {
            recommendations.push(this.create(request, contracts_1.GovernanceRecommendationType
                .REDUCE_BLAST_RADIUS, 85, "Reduce blast radius", "The expected blast radius is high and should be segmented before execution.", true, 94, {
                blastRadius: request.blastRadius ??
                    0,
            }));
        }
        if (request.requestedRiskLevel ===
            contracts_1.GovernanceRiskLevel.HIGH ||
            request.requestedRiskLevel ===
                contracts_1.GovernanceRiskLevel.CRITICAL) {
            recommendations.push(this.create(request, contracts_1.GovernanceRecommendationType
                .REQUIRE_MONITORING, 80, "Enhanced runtime monitoring required", "High-risk requests require enhanced monitoring during and after execution.", true, 98, {
                requestedRiskLevel: request.requestedRiskLevel,
            }));
            recommendations.push(this.create(request, contracts_1.GovernanceRecommendationType
                .ESCALATE, 75, "Escalate for senior approval", "The request should be reviewed by senior operations and security approvers.", true, 97, {
                requestedRiskLevel: request.requestedRiskLevel,
            }));
        }
        if (!request.changeWindowId &&
            request.environment ===
                "production") {
            recommendations.push(this.create(request, contracts_1.GovernanceRecommendationType
                .REQUIRE_MAINTENANCE_WINDOW, 70, "Approved change window required", "Production changes should be linked to an approved change window.", true, 96, {
                environment: request.environment,
            }));
        }
        if (recommendations.length === 0) {
            recommendations.push(this.create(request, contracts_1.GovernanceRecommendationType
                .APPROVE, 10, "Request is suitable for approval", "No blocking governance conditions were detected.", false, 90, {
                recommendation: "standard_approval",
            }));
        }
        return recommendations;
    }
    list() {
        return this.store
            .listRecommendations();
    }
    create(request, type, priority, title, description, required, confidence, metadata) {
        const recommendation = {
            id: (0, crypto_1.randomUUID)(),
            requestId: request.id,
            type,
            priority,
            title,
            description,
            required,
            confidence,
            metadata,
            createdAt: new Date().toISOString(),
        };
        const saved = this.store
            .saveRecommendation(recommendation);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .RECOMMENDATION_CREATED,
            aggregateType: "governance_recommendation",
            aggregateId: saved.id,
            actor: {
                id: "avos-governance-recommendation-engine",
                type: "system",
                name: "AVOS Governance Recommendation Engine",
                roles: [
                    "runtime_governance",
                    "decision_support",
                ],
            },
            payload: {
                recommendationId: saved.id,
                requestId: saved.requestId,
                type: saved.type,
                priority: saved.priority,
                required: saved.required,
                confidence: saved.confidence,
            },
        });
        return saved;
    }
};
exports.RuntimeGovernanceRecommendationService = RuntimeGovernanceRecommendationService;
exports.RuntimeGovernanceRecommendationService = RuntimeGovernanceRecommendationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeGovernanceRecommendationService);
//# sourceMappingURL=runtime-governance-recommendation.service.js.map