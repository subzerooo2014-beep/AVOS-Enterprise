import { Injectable } from "@nestjs/common";
import { DeltaComparisonEngineService } from "./delta-comparison-engine.service";
import { ExecutiveDashboardService } from "./executive-dashboard.service";
import { HistoricalTimelineService } from "./historical-timeline.service";
import { TrendAnalyticsEngineService } from "./trend-analytics-engine.service";

@Injectable()
export class OmegaExecutiveFacadeService {
  constructor(
    private readonly dashboard: ExecutiveDashboardService,
    private readonly timeline: HistoricalTimelineService,
    private readonly trends: TrendAnalyticsEngineService,
    private readonly delta: DeltaComparisonEngineService,
  ) {}

  status() {
    return {
      system: "AVOS Omega Executive Intelligence",
      pack: "Mega Pack Omega-1 Part 4C",
      version: "2.0.0-omega.4c",
      status: "healthy",
      capabilities: 6,
      humanFinalAuthority: true,
      next: "Omega-1 Part 4D",
    };
  }

  overview() {
    return this.dashboard.generate();
  }

  history() {
    return {
      snapshots: this.timeline.seed(),
    };
  }

  trendReport() {
    const snapshots = this.timeline.seed();
    return {
      trends: this.trends.analyze(snapshots),
    };
  }

  deltaReport() {
    const snapshots = this.timeline.seed();
    const baseline = snapshots[0];
    const current = snapshots[snapshots.length - 1];

    if (!baseline || !current) {
      throw new Error("Not enough snapshots for delta comparison.");
    }

    return this.delta.compare(baseline, current);
  }
}

