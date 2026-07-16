import { Injectable } from "@nestjs/common";
import { OperationalTwinRegistryService } from "./operational-twin-registry.service";
import type { PredictiveTwinInsightRecord } from "./enterprise-digital-twin-operations.types";

@Injectable()
export class PredictiveTwinAnalyticsService {
  private readonly insights: PredictiveTwinInsightRecord[] = [];

  constructor(private readonly twins: OperationalTwinRegistryService) {}

  analyze(twinId: string): PredictiveTwinInsightRecord {
    const twin = this.twins.get(twinId);
    const numericValues = Object.values(twin.state).filter(
      (value): value is number => typeof value === "number",
    );

    const score =
      numericValues.length === 0
        ? 50
        : Math.max(
            0,
            Math.min(
              100,
              numericValues.reduce((total, value) => total + value, 0) /
                numericValues.length,
            ),
          );

    const confidence = Math.max(
      0.1,
      Math.min(1, numericValues.length / 10),
    );

    const factors = Object.entries(twin.state)
      .filter(([, value]) => typeof value === "number")
      .map(([key, value]) => `${key}=${value}`);

    const insight: PredictiveTwinInsightRecord = {
      id: `predictive-twin-insight-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      twinId,
      category: twin.twinType === "ASSET" ? "ASSET_PREDICTION" : "PROCESS_PREDICTION",
      score,
      confidence,
      summary:
        score >= 70
          ? "Twin performance is projected to remain healthy."
          : score >= 40
            ? "Twin performance requires monitoring."
            : "Twin performance is projected to deteriorate.",
      factors,
      createdAt: new Date().toISOString(),
    };

    this.insights.unshift(insight);
    return this.clone(insight);
  }

  list(): PredictiveTwinInsightRecord[] {
    return this.insights.map((insight) => this.clone(insight));
  }

  count(): number {
    return this.insights.length;
  }

  private clone(
    insight: PredictiveTwinInsightRecord,
  ): PredictiveTwinInsightRecord {
    return {
      ...insight,
      factors: [...insight.factors],
    };
  }
}
