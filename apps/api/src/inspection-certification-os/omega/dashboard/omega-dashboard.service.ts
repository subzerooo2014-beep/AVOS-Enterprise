import { Injectable } from "@nestjs/common";
import { OmegaHistoryService } from "../history/omega-history.service";
import { OmegaPolicyEngineService } from "../engines/omega-policy-engine.service";
import { OmegaRuleEngineService } from "../engines/omega-rule-engine.service";
import { OmegaDashboardSnapshot } from "../omega.types";

@Injectable()
export class OmegaDashboardService {
  constructor(
    private readonly history: OmegaHistoryService,
    private readonly rules: OmegaRuleEngineService,
    private readonly policies: OmegaPolicyEngineService,
  ) {}

  snapshot(): OmegaDashboardSnapshot {
    const assessments = this.history.list(100);
    const latest = assessments[0] ?? null;

    const averageQuality =
      assessments.length === 0
        ? 0
        : assessments.reduce(
            (sum, assessment) => sum + assessment.score.quality,
            0,
          ) / assessments.length;

    const averageRisk =
      assessments.length === 0
        ? 0
        : assessments.reduce(
            (sum, assessment) => sum + assessment.score.risk,
            0,
          ) / assessments.length;

    const criticalFindings = assessments.reduce(
      (sum, assessment) =>
        sum +
        assessment.findings.filter(
          (finding) => finding.severity === "critical",
        ).length,
      0,
    );

    return {
      generatedAt: new Date().toISOString(),
      totalAssessments: assessments.length,
      latestDecision: latest?.decision ?? "none",
      averageQuality: Number(averageQuality.toFixed(2)),
      averageRisk: Number(averageRisk.toFixed(2)),
      criticalFindings,
      activeRules: this.rules.list().filter((rule) => rule.enabled).length,
      activePolicies: this.policies.list().length,
    };
  }
}
