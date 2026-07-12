import { UltraFFinding, UltraFSeverity } from "./contracts";

export interface ReleaseCandidate {
  systemKey: string;
  version: string;
  validationScore: number;
  securityScore: number;
  architectureScore: number;
  rollbackReady: boolean;
  changeRisk: number;
}

export interface ReleaseGovernanceDecision {
  approved: boolean;
  strategy: "full" | "canary" | "progressive" | "blocked";
  rolloutPercent: number;
  controls: string[];
  findings: UltraFFinding[];
  decidedAt: string;
}

export class AutonomousReleaseGovernance {
  decide(candidate: ReleaseCandidate): ReleaseGovernanceDecision {
    const findings: UltraFFinding[] = [];
    const controls = new Set<string>();

    if (!candidate.rollbackReady) {
      findings.push({
        code: "ROLLBACK_NOT_READY",
        severity: UltraFSeverity.ERROR,
        message: "Release candidate is not rollback ready.",
        subject: candidate.version,
        metadata: {},
      });
    }

    if (candidate.securityScore < 80) {
      findings.push({
        code: "RELEASE_SECURITY_SCORE_LOW",
        severity: UltraFSeverity.ERROR,
        message: "Release security score is below the required threshold.",
        subject: candidate.version,
        metadata: { securityScore: candidate.securityScore },
      });
    }

    const averageScore = Math.round(
      (candidate.validationScore +
        candidate.securityScore +
        candidate.architectureScore) /
        3,
    );

    if (candidate.changeRisk >= 70) {
      controls.add("executive-approval");
      controls.add("canary-observability");
    } else if (candidate.changeRisk >= 40) {
      controls.add("progressive-delivery");
      controls.add("automatic-rollback");
    }

    let strategy: ReleaseGovernanceDecision["strategy"] = "blocked";
    let rolloutPercent = 0;

    if (
      candidate.rollbackReady &&
      candidate.securityScore >= 80 &&
      averageScore >= 70
    ) {
      if (candidate.changeRisk >= 70) {
        strategy = "canary";
        rolloutPercent = 5;
      } else if (candidate.changeRisk >= 40) {
        strategy = "progressive";
        rolloutPercent = 25;
      } else {
        strategy = "full";
        rolloutPercent = 100;
      }
    }

    return {
      approved: strategy !== "blocked",
      strategy,
      rolloutPercent,
      controls: Array.from(controls),
      findings,
      decidedAt: new Date().toISOString(),
    };
  }
}
