import {
  CascadingFailureRisk,
  GovernanceDecision,
  GovernanceRiskLevel,
} from "../contracts";

export function clampGovernanceScore(
  score: number,
): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Math.round(score)),
  );
}

export function governanceRiskFromScore(
  score: number,
): GovernanceRiskLevel {
  const normalized =
    clampGovernanceScore(score);

  if (normalized >= 85) {
    return GovernanceRiskLevel.CRITICAL;
  }

  if (normalized >= 65) {
    return GovernanceRiskLevel.HIGH;
  }

  if (normalized >= 40) {
    return GovernanceRiskLevel.MEDIUM;
  }

  if (normalized >= 15) {
    return GovernanceRiskLevel.LOW;
  }

  return GovernanceRiskLevel.INFORMATIONAL;
}

export function governanceDecisionFromRisk(
  riskLevel: GovernanceRiskLevel,
): GovernanceDecision {
  switch (riskLevel) {
    case GovernanceRiskLevel.CRITICAL:
      return GovernanceDecision.BLOCK;

    case GovernanceRiskLevel.HIGH:
      return GovernanceDecision.REQUIRE_APPROVAL;

    case GovernanceRiskLevel.MEDIUM:
      return GovernanceDecision.ALLOW_WITH_MONITORING;

    case GovernanceRiskLevel.LOW:
    case GovernanceRiskLevel.INFORMATIONAL:
    default:
      return GovernanceDecision.ALLOW;
  }
}

export function approvalsFromGovernanceRisk(
  riskLevel: GovernanceRiskLevel,
): number {
  switch (riskLevel) {
    case GovernanceRiskLevel.CRITICAL:
      return 3;

    case GovernanceRiskLevel.HIGH:
      return 2;

    case GovernanceRiskLevel.MEDIUM:
      return 1;

    default:
      return 0;
  }
}

export function cascadeRiskFromScore(
  score: number,
): CascadingFailureRisk {
  const normalized =
    clampGovernanceScore(score);

  if (normalized >= 85) {
    return CascadingFailureRisk.CRITICAL;
  }

  if (normalized >= 65) {
    return CascadingFailureRisk.HIGH;
  }

  if (normalized >= 40) {
    return CascadingFailureRisk.MEDIUM;
  }

  if (normalized >= 15) {
    return CascadingFailureRisk.LOW;
  }

  return CascadingFailureRisk.NONE;
}
