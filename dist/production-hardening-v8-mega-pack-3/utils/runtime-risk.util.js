"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clampScore = clampScore;
exports.riskLevelFromScore = riskLevelFromScore;
exports.decisionFromRiskLevel = decisionFromRiskLevel;
exports.requiredApprovalsFromRiskLevel = requiredApprovalsFromRiskLevel;
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
function clampScore(score) {
    if (!Number.isFinite(score)) {
        return 0;
    }
    return Math.min(100, Math.max(0, Math.round(score)));
}
function riskLevelFromScore(score) {
    const normalized = clampScore(score);
    if (normalized >= 85) {
        return runtime_resilience_enums_1.RuntimeRiskLevel.CRITICAL;
    }
    if (normalized >= 65) {
        return runtime_resilience_enums_1.RuntimeRiskLevel.HIGH;
    }
    if (normalized >= 40) {
        return runtime_resilience_enums_1.RuntimeRiskLevel.MEDIUM;
    }
    if (normalized >= 15) {
        return runtime_resilience_enums_1.RuntimeRiskLevel.LOW;
    }
    return runtime_resilience_enums_1.RuntimeRiskLevel.INFORMATIONAL;
}
function decisionFromRiskLevel(riskLevel) {
    switch (riskLevel) {
        case runtime_resilience_enums_1.RuntimeRiskLevel.CRITICAL:
            return runtime_resilience_enums_1.RuntimeDecision.BLOCK;
        case runtime_resilience_enums_1.RuntimeRiskLevel.HIGH:
            return runtime_resilience_enums_1.RuntimeDecision.REQUIRE_APPROVAL;
        case runtime_resilience_enums_1.RuntimeRiskLevel.MEDIUM:
            return runtime_resilience_enums_1.RuntimeDecision.ALLOW_WITH_MONITORING;
        case runtime_resilience_enums_1.RuntimeRiskLevel.LOW:
        case runtime_resilience_enums_1.RuntimeRiskLevel.INFORMATIONAL:
        default:
            return runtime_resilience_enums_1.RuntimeDecision.ALLOW;
    }
}
function requiredApprovalsFromRiskLevel(riskLevel) {
    switch (riskLevel) {
        case runtime_resilience_enums_1.RuntimeRiskLevel.CRITICAL:
            return 3;
        case runtime_resilience_enums_1.RuntimeRiskLevel.HIGH:
            return 2;
        case runtime_resilience_enums_1.RuntimeRiskLevel.MEDIUM:
            return 1;
        case runtime_resilience_enums_1.RuntimeRiskLevel.LOW:
        case runtime_resilience_enums_1.RuntimeRiskLevel.INFORMATIONAL:
        default:
            return 0;
    }
}
//# sourceMappingURL=runtime-risk.util.js.map