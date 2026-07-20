import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AdaptationCycle,
  GrowthRecommendation,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class ContinuousGrowthAdaptationService {
  private readonly cycles = new Map<string, AdaptationCycle>();

  adapt(input: {
    tenantId: string;
    productId: string;
    previousState: Record<string, number>;
    currentState: Record<string, number>;
    recommendations: GrowthRecommendation[];
  }): AdaptationCycle {
    const detectedChanges: string[] = [];
    const proposedAdaptations: string[] = [];

    for (const [metric, current] of Object.entries(input.currentState)) {
      const previous = input.previousState[metric];
      if (previous === undefined) continue;
      const delta = current - previous;
      if (delta !== 0) {
        detectedChanges.push(`${metric}: ${delta > 0 ? "+" : ""}${delta}`);
      }
      if (delta < 0) {
        proposedAdaptations.push(
          `Increase optimization priority for ${metric}`,
        );
      } else if (delta > 0) {
        proposedAdaptations.push(
          `Scale successful actions contributing to ${metric}`,
        );
      }
    }

    const cycle: AdaptationCycle = {
      id: `aage-adaptation:${randomUUID()}`,
      tenantId: input.tenantId,
      productId: input.productId,
      previousState: { ...input.previousState },
      currentState: { ...input.currentState },
      detectedChanges,
      proposedAdaptations,
      recommendations: input.recommendations.map((item) =>
        JSON.parse(JSON.stringify(item)) as GrowthRecommendation,
      ),
      status: "pending-approval",
      generatedAt: new Date().toISOString(),
    };
    this.cycles.set(cycle.id, cycle);
    return this.clone(cycle);
  }

  approve(id: string) {
    const item = this.cycles.get(id);
    if (!item) return undefined;
    item.status = "approved";
    return this.clone(item);
  }

  apply(id: string) {
    const item = this.cycles.get(id);
    if (!item || item.status !== "approved") return undefined;
    item.status = "applied";
    return this.clone(item);
  }

  list() {
    return [...this.cycles.values()].map((item) => this.clone(item));
  }

  health() {
    return {
      status: "operational",
      adaptationCycles: this.cycles.size,
      feedbackDriven: true,
      continuousLearningReady: true,
      approvalBeforeApplication: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(value: AdaptationCycle): AdaptationCycle {
    return JSON.parse(JSON.stringify(value)) as AdaptationCycle;
  }
}