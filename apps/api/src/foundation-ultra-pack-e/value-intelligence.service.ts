import { Injectable } from "@nestjs/common";
import {
  ValueAssessment,
  ValueMetric,
} from "./foundation-ultra-pack-e.types";
import { FoundationUltraPackEFileStoreService } from "./foundation-ultra-pack-e-file-store.service";

@Injectable()
export class ValueIntelligenceService {
  constructor(
    private readonly store: FoundationUltraPackEFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  recordMetric(
    input: Omit<ValueMetric, "id" | "recordedAt">,
  ): ValueMetric {
    const metric: ValueMetric = {
      ...input,
      id: this.id("value-metric"),
      confidence: Math.max(0, Math.min(1, input.confidence)),
      recordedAt: this.now(),
    };

    this.store.writeJson(`value-metrics/${metric.id}.json`, metric);
    return metric;
  }

  listMetrics(assetId?: string): ValueMetric[] {
    const metrics = this.store.listJson<ValueMetric>("value-metrics");
    return assetId
      ? metrics.filter((metric) => metric.assetId === assetId)
      : metrics;
  }

  assess(assetId: string): ValueAssessment {
    const metrics = this.listMetrics(assetId);

    const scoreBy = (types: ValueMetric["metric"][]) => {
      const selected = metrics.filter((metric) => types.includes(metric.metric));
      if (selected.length === 0) {
        return 0;
      }

      return Math.round(
        selected.reduce(
          (sum, metric) =>
            sum + Math.max(0, Math.min(100, metric.value)) * metric.confidence,
          0,
        ) / selected.length,
      );
    };

    const financialScore = scoreBy([
      "revenue-impact",
      "cost-reduction",
      "time-saved",
    ]);
    const strategicScore = scoreBy(["strategic-value"]);
    const riskScore = scoreBy(["risk-reduction"]);
    const reuseScore = scoreBy(["reuse-score"]);
    const trustScore = scoreBy(["trust-value"]);

    const components = [
      financialScore,
      strategicScore,
      riskScore,
      reuseScore,
      trustScore,
    ];

    const totalScore = Math.round(
      components.reduce((sum, value) => sum + value, 0) /
        components.length,
    );

    const assessment: ValueAssessment = {
      id: this.id("value-assessment"),
      assetId,
      totalScore,
      financialScore,
      strategicScore,
      riskScore,
      reuseScore,
      trustScore,
      recommendations: [
        ...(financialScore < 70 ? ["Strengthen measurable financial outcomes."] : []),
        ...(reuseScore < 70 ? ["Increase reusable capability and contract coverage."] : []),
        ...(trustScore < 70 ? ["Add stronger trust and evidence signals."] : []),
        ...(components.every((score) => score >= 70)
          ? ["Asset demonstrates strong multidimensional value."]
          : []),
      ],
      assessedAt: this.now(),
    };

    this.store.writeJson(`value-assessments/${assessment.id}.json`, assessment);
    return assessment;
  }

  listAssessments(): ValueAssessment[] {
    return this.store.listJson<ValueAssessment>("value-assessments");
  }
}