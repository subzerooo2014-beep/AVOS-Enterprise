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
exports.RuntimeGovernanceApprovalMatrixService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
let RuntimeGovernanceApprovalMatrixService = class RuntimeGovernanceApprovalMatrixService {
    constructor(store) {
        this.store = store;
    }
    createRule(dto) {
        const rule = {
            id: (0, crypto_1.randomUUID)(),
            name: dto.name,
            environment: dto.environment,
            requestTypes: dto.requestTypes,
            minimumRiskLevel: dto.minimumRiskLevel,
            maximumRiskLevel: dto.maximumRiskLevel,
            minimumBlastRadius: dto.minimumBlastRadius,
            minimumBusinessCriticality: dto.minimumBusinessCriticality,
            rollbackPlanRequired: dto.rollbackPlanRequired,
            minimumTestCoverage: dto.minimumTestCoverage,
            tier: dto.tier,
            requiredApprovals: dto.requiredApprovals,
            requiredRoles: dto.requiredRoles,
            enabled: dto.enabled,
            priority: dto.priority,
            metadata: (dto.metadata ?? {}),
        };
        return this.store
            .saveApprovalMatrixRule(rule);
    }
    listRules() {
        return this.store
            .listApprovalMatrixRules();
    }
    getRule(id) {
        const item = this.store
            .getApprovalMatrixRule(id);
        if (!item) {
            throw new common_1.NotFoundException(`Approval matrix rule ${id} was not found`);
        }
        return item;
    }
    evaluate(request) {
        const risk = request.evaluatedRiskLevel ??
            request.requestedRiskLevel;
        const matched = this.listRules()
            .filter((rule) => rule.enabled &&
            (!rule.environment ||
                rule.environment ===
                    request.environment) &&
            rule.requestTypes.includes(request.type) &&
            this.isRiskWithinRange(risk, rule.minimumRiskLevel, rule.maximumRiskLevel) &&
            (rule.minimumBlastRadius ===
                undefined ||
                (request.blastRadius ??
                    0) >=
                    rule.minimumBlastRadius) &&
            (rule.minimumBusinessCriticality ===
                undefined ||
                (request.businessCriticality ??
                    0) >=
                    rule.minimumBusinessCriticality) &&
            (!rule.rollbackPlanRequired ||
                request.rollbackPlanAvailable) &&
            (rule.minimumTestCoverage ===
                undefined ||
                (request.testCoverage ??
                    0) >=
                    rule.minimumTestCoverage))
            .sort((a, b) => b.priority - a.priority);
        const tier = matched[0]?.tier ??
            contracts_1.GovernanceApprovalTier.STANDARD;
        const requiredApprovals = matched.length === 0
            ? request.approvalsRequired
            : Math.max(...matched.map((rule) => rule.requiredApprovals));
        const requiredRoles = Array.from(new Set(matched.flatMap((rule) => rule.requiredRoles)));
        return {
            requestId: request.id,
            tier,
            requiredApprovals,
            requiredRoles,
            matchedRuleIds: matched.map((rule) => rule.id),
            reasons: matched.length > 0
                ? matched.map((rule) => `Matched approval rule: ${rule.name}`)
                : [
                    "No explicit approval matrix rule matched",
                ],
            evaluatedAt: new Date().toISOString(),
        };
    }
    isRiskWithinRange(value, minimum, maximum) {
        const rank = {
            [contracts_1.GovernanceRiskLevel.INFORMATIONAL]: 0,
            [contracts_1.GovernanceRiskLevel.LOW]: 1,
            [contracts_1.GovernanceRiskLevel.MEDIUM]: 2,
            [contracts_1.GovernanceRiskLevel.HIGH]: 3,
            [contracts_1.GovernanceRiskLevel.CRITICAL]: 4,
        };
        return (rank[value] >=
            rank[minimum] &&
            rank[value] <=
                rank[maximum]);
    }
};
exports.RuntimeGovernanceApprovalMatrixService = RuntimeGovernanceApprovalMatrixService;
exports.RuntimeGovernanceApprovalMatrixService = RuntimeGovernanceApprovalMatrixService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], RuntimeGovernanceApprovalMatrixService);
//# sourceMappingURL=runtime-governance-approval-matrix.service.js.map