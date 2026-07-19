import { Injectable } from "@nestjs/common";
import {
  HistoricalSnapshot,
  TrendSeries,
} from "./omega-executive.types";

@Injectable()
export class TrendAnalyticsEngineService {
  analyze(
    snapshots: readonly HistoricalSnapshot[],
  ): readonly TrendSeries[] {
    return [
      this.series("readinessScore", snapshots, (item) => item.readinessScore, true),
      this.series("riskScore", snapshots, (item) => item.riskScore, false),
      this.series("openIssues", snapshots, (item) => item.openIssues, false),
      this.series("certifiedAssets", snapshots, (item) => item.certifiedAssets, true),
      this.series("pendingApprovals", snapshots, (item) => item.pendingApprovals, false),
    ];
  }

  private series(
    metric: string,
    snapshots: readonly HistoricalSnapshot[],
    selector: (snapshot: HistoricalSnapshot) => number,
    higherIsBetter: boolean,
  ): TrendSeries {
    const points = snapshots.map((snapshot) => ({
      timestamp: snapshot.capturedAt,
      value: selector(snapshot),
    }));

    const first = points[0]?.value ?? 0;
    const last = points[points.length - 1]?.value ?? 0;
    const rawChange = first === 0 ? 0 : ((last - first) / Math.abs(first)) * 100;
    const effectiveChange = higherIsBetter ? rawChange : -rawChange;

    return {
      metric,
      points,
      direction:
        effectiveChange > 1
          ? "improving"
          : effectiveChange < -1
            ? "declining"
            : "stable",
      changePercent: Number(rawChange.toFixed(2)),
    };
  }
}

