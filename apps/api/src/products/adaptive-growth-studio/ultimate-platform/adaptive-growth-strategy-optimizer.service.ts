import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";

@Injectable()
export class AdaptiveGrowthStrategyOptimizerService {
  constructor(private readonly store: AdaptiveGrowthUltimateStoreService) {}

  optimize(key: string, parameters: Record<string, unknown> = {}) {
    const outcomes = [...this.store.outcomes.values()];
    const successful = outcomes.filter((item) => item.success).length;
    const score = outcomes.length === 0 ? 0.7 : successful / outcomes.length;
    const previous = this.store.strategies.get(key);

    const strategy = {
      key,
      version: (previous?.version ?? 0) + 1,
      score: Number(score.toFixed(4)),
      executions: outcomes.length,
      successfulExecutions: successful,
      parameters: {
        ...(previous?.parameters ?? {}),
        ...parameters,
        humanApprovalForHighRisk: true,
        adaptiveThreshold: Number(Math.max(0.55, score).toFixed(4)),
      },
      updatedAt: new Date().toISOString(),
    };

    this.store.strategies.set(key, strategy);
    return strategy;
  }

  list() {
    return [...this.store.strategies.values()];
  }

  status() {
    return {
      status: "operational",
      strategies: this.store.strategies.size,
      continuousOptimization: true,
      humanAuthorityPreserved: true,
    };
  }
}