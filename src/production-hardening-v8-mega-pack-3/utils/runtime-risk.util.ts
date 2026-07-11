import {
  RuntimeDecision,
  RuntimeRiskLevel,
} from "../contracts/runtime-resilience.enums";

export function clampScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function riskLevelFromScore(score: number): RuntimeRiskLevel {
  const normalized = clampScore(score);

  if (normalized >= 85) {
    return RuntimeRiskLevel.CRITICAL;
  }

  if (normalized >= 65) {
    return RuntimeRiskLevel.HIGH;
  }

  if (normalized >= 40) {
    return RuntimeRiskLevel.MEDIUM;
  }

  if (normalized >= 15) {
    return RuntimeRiskLevel.LOW;
  }

  return RuntimeRiskLevel.INFORMATIONAL;
}

export function decisionFromRiskLevel(
  riskLevel: RuntimeRiskLevel,
): RuntimeDecision {
  switch (riskLevel) {
    case RuntimeRiskLevel.CRITICAL:
      return RuntimeDecision.BLOCK;

    case RuntimeRiskLevel.HIGH:
      return RuntimeDecision.REQUIRE_APPROVAL;

    case RuntimeRiskLevel.MEDIUM:
      return RuntimeDecision.ALLOW_WITH_MONITORING;

    case RuntimeRiskLevel.LOW:
    case RuntimeRiskLevel.INFORMATIONAL:
    default:
      return RuntimeDecision.ALLOW;
  }
}

export function requiredApprovalsFromRiskLevel(
  riskLevel: RuntimeRiskLevel,
): number {
  switch (riskLevel) {
    case RuntimeRiskLevel.CRITICAL:
      return 3;

    case RuntimeRiskLevel.HIGH:
      return 2;

    case RuntimeRiskLevel.MEDIUM:
      return 1;

    case RuntimeRiskLevel.LOW:
    case RuntimeRiskLevel.INFORMATIONAL:
    default:
      return 0;
  }
}
