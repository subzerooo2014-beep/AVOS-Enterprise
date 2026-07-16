import { Injectable } from "@nestjs/common";
import type { PredictiveIntelligenceV2 } from "./autonomous-intelligence-v2.types";

@Injectable()
export class PredictiveIntelligenceV2Service {
  private readonly predictions: PredictiveIntelligenceV2[] = [];

  generate(
    category: string,
    values: number[],
    summary: string,
    factors: string[] = [],
  ): PredictiveIntelligenceV2 {
    const score =
      values.length === 0
        ? 0
        : values.reduce((total, value) => total + value, 0) / values.length;

    const prediction: PredictiveIntelligenceV2 = {
      id: `predictive-intelligence-v2-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      category,
      score: Math.max(0, Math.min(100, score)),
      confidence: Math.max(0.1, Math.min(1, values.length / 10)),
      summary,
      factors: [...factors],
      createdAt: new Date().toISOString(),
    };

    this.predictions.unshift(prediction);
    return this.clone(prediction);
  }

  list(): PredictiveIntelligenceV2[] {
    return this.predictions.map((prediction) => this.clone(prediction));
  }

  count(): number {
    return this.predictions.length;
  }

  private clone(
    prediction: PredictiveIntelligenceV2,
  ): PredictiveIntelligenceV2 {
    return { ...prediction, factors: [...prediction.factors] };
  }
}
