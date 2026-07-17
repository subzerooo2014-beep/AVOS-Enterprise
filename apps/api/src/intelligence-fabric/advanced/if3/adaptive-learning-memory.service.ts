import { Injectable } from "@nestjs/common";
import {
  AdaptiveLearningSignal,
  EngineLearningProfile,
} from "../contracts/advanced-intelligence.contracts";

@Injectable()
export class AdaptiveLearningMemoryService {
  private readonly signals: AdaptiveLearningSignal[] = [];

  record(
    signal: Omit<AdaptiveLearningSignal, "id" | "createdAt">,
  ): AdaptiveLearningSignal {
    const item: AdaptiveLearningSignal = {
      ...signal,
      id: `if3-learning:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };

    this.signals.push(item);

    if (this.signals.length > 5000) {
      this.signals.splice(0, this.signals.length - 5000);
    }

    return item;
  }

  list(limit = 100): readonly AdaptiveLearningSignal[] {
    const normalized = Math.min(Math.max(limit, 1), 1000);
    return this.signals.slice(-normalized).reverse();
  }

  profiles(): readonly EngineLearningProfile[] {
    const groups = new Map<string, AdaptiveLearningSignal[]>();

    for (const signal of this.signals) {
      const items = groups.get(signal.engineId) ?? [];
      items.push(signal);
      groups.set(signal.engineId, items);
    }

    return [...groups.entries()].map(([engineId, items]) => {
      const successes = items.filter((item) => item.outcome === "success").length;
      const averageConfidence =
        items.reduce((sum, item) => sum + item.confidence, 0) / items.length;
      const averageReward =
        items.reduce((sum, item) => sum + item.reward, 0) / items.length;
      const averageLatencyMs =
        items.reduce((sum, item) => sum + item.latencyMs, 0) / items.length;

      const successRate = successes / items.length;
      const adaptiveWeight = Math.min(
        2,
        Math.max(
          0.2,
          successRate * 0.5 +
            averageConfidence * 0.3 +
            Math.max(0, Math.min(1, averageReward)) * 0.2,
        ),
      );

      return {
        engineId,
        samples: items.length,
        successRate: Number(successRate.toFixed(4)),
        averageConfidence: Number(averageConfidence.toFixed(4)),
        averageReward: Number(averageReward.toFixed(4)),
        averageLatencyMs: Number(averageLatencyMs.toFixed(2)),
        adaptiveWeight: Number(adaptiveWeight.toFixed(4)),
        updatedAt: new Date().toISOString(),
      };
    });
  }

  count(): number {
    return this.signals.length;
  }
}