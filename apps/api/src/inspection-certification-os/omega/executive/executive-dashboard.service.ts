import { Injectable } from "@nestjs/common";
import { DeltaComparisonEngineService } from "./delta-comparison-engine.service";
import { ExecutiveKpiEngineService } from "./executive-kpi-engine.service";
import { HistoricalTimelineService } from "./historical-timeline.service";
import { TrendAnalyticsEngineService } from "./trend-analytics-engine.service";
import { ExecutiveDashboard } from "./omega-executive.types";

@Injectable()
export class ExecutiveDashboardService {
  constructor(
    private readonly timeline: HistoricalTimelineService,
    private readonly kpis: ExecutiveKpiEngineService,
    private readonly trends: TrendAnalyticsEngineService,
    private readonly delta: DeltaComparisonEngineService,
  ) {}

  generate(): {
    readonly dashboard: ExecutiveDashboard;
    readonly trends: ReturnType<TrendAnalyticsEngineService["analyze"]>;
    readonly delta: ReturnType<DeltaComparisonEngineService["compare"]>;
    readonly history: ReturnType<HistoricalTimelineService["all"]>;
  } {
    const history = this.timeline.seed();
    const current = history[history.length - 1];

    if (!current) {
      throw new Error("Executive timeline is empty.");
    }

    const previous = history[history.length - 2];
    const baseline = history[0] ?? current;
    const kpis = this.kpis.calculate(current, previous);

    const warnings = [
      current.riskScore > 35 ? "Enterprise risk remains above target." : null,
      current.openIssues > 8 ? "Open issues exceed the executive threshold." : null,
      current.pendingApprovals > 3 ? "Pending approvals require attention." : null,
    ].filter((item): item is string => item !== null);

    const highlights = [
      `Readiness score reached ${current.readinessScore}.`,
      `Certified assets reached ${current.certifiedAssets}.`,
      `Open issues reduced to ${current.openIssues}.`,
      "Human Final Authority remains enforced.",
    ];

    const dashboard: ExecutiveDashboard = {
      generatedAt: new Date().toISOString(),
      status:
        current.riskScore >= 70
          ? "critical"
          : current.riskScore > 35 || current.openIssues > 8
            ? "attention-required"
            : "healthy",
      readinessScore: current.readinessScore,
      riskScore: current.riskScore,
      kpis,
      highlights,
      warnings,
      humanFinalAuthority: true,
    };

    return {
      dashboard,
      trends: this.trends.analyze(history),
      delta: this.delta.compare(baseline, current),
      history,
    };
  }
}

