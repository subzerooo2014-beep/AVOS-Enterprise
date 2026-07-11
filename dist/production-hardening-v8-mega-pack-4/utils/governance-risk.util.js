"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clampGovernanceScore = clampGovernanceScore;
exports.governanceRiskFromScore = governanceRiskFromScore;
exports.governanceDecisionFromRisk = governanceDecisionFromRisk;
exports.approvalsFromGovernanceRisk = approvalsFromGovernanceRisk;
exports.cascadeRiskFromScore = cascadeRiskFromScore;
const contracts_1 = require("../contracts");
function clampGovernanceScore(score) {
    if (!Number.isFinite(score)) {
        return 0;
    }
    return Math.min(100, Math.max(0, Math.round(score)));
}
function governanceRiskFromScore(score) {
    const normalized = clampGovernanceScore(score);
    if (normalized >= 85) {
        return contracts_1.GovernanceRiskLevel.CRITICAL;
    }
    if (normalized >= 65) {
        return contracts_1.GovernanceRiskLevel.HIGH;
    }
    if (normalized >= 40) {
        return contracts_1.GovernanceRiskLevel.MEDIUM;
    }
    if (normalized >= 15) {
        return contracts_1.GovernanceRiskLevel.LOW;
    }
    return contracts_1.GovernanceRiskLevel.INFORMATIONAL;
}
function governanceDecisionFromRisk(riskLevel) {
    switch (riskLevel) {
        case contracts_1.GovernanceRiskLevel.CRITICAL:
            return contracts_1.GovernanceDecision.BLOCK;
        case contracts_1.GovernanceRiskLevel.HIGH:
            return contracts_1.GovernanceDecision.REQUIRE_APPROVAL;
        case contracts_1.GovernanceRiskLevel.MEDIUM:
            return contracts_1.GovernanceDecision.ALLOW_WITH_MONITORING;
        case contracts_1.GovernanceRiskLevel.LOW:
        case contracts_1.GovernanceRiskLevel.INFORMATIONAL:
        default:
            return contracts_1.GovernanceDecision.ALLOW;
    }
}
function approvalsFromGovernanceRisk(riskLevel) {
    switch (riskLevel) {
        case contracts_1.GovernanceRiskLevel.CRITICAL:
            return 3;
        case contracts_1.GovernanceRiskLevel.HIGH:
            return 2;
        case contracts_1.GovernanceRiskLevel.MEDIUM:
            return 1;
        default:
            return 0;
    }
}
function cascadeRiskFromScore(score) {
    const normalized = clampGovernanceScore(score);
    if (normalized >= 85) {
        return contracts_1.CascadingFailureRisk.CRITICAL;
    }
    if (normalized >= 65) {
        return contracts_1.CascadingFailureRisk.HIGH;
    }
    if (normalized >= 40) {
        return contracts_1.CascadingFailureRisk.MEDIUM;
    }
    if (normalized >= 15) {
        return contracts_1.CascadingFailureRisk.LOW;
    }
    return contracts_1.CascadingFailureRisk.NONE;
}
//# sourceMappingURL=governance-risk.util.js.map