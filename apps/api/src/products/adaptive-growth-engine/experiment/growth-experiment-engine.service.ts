import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  ExperimentPlan,
  GrowthOpportunity,
  ProductMarketInput,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class GrowthExperimentEngineService {
  private readonly experiments = new Map<string, ExperimentPlan>();

  design(
    input: ProductMarketInput,
    opportunities: GrowthOpportunity[],
  ): ExperimentPlan[] {
    return opportunities.slice(0, 3).map((opportunity) => {
      const experiment: ExperimentPlan = {
        id: `aage-experiment:${randomUUID()}`,
        tenantId: input.tenantId,
        productId: input.productId,
        name: `${opportunity.title} Experiment`,
        hypothesis: `Applying ${opportunity.title.toLowerCase()} will improve the primary metric.`,
        metric:
          opportunity.category === "retention"
            ? "retention-rate"
            : opportunity.category === "revenue"
              ? "revenue-per-visitor"
              : "conversion-rate",
        control: "current-experience",
        variants: ["adaptive-variant-a", "adaptive-variant-b"],
        sampleSize: 2000,
        confidenceTarget: 0.95,
        status: "pending-approval",
        generatedAt: new Date().toISOString(),
      };
      this.experiments.set(experiment.id, experiment);
      return this.clone(experiment);
    });
  }

  approve(id: string) {
    const item = this.experiments.get(id);
    if (!item) return undefined;
    item.status = "approved";
    return this.clone(item);
  }

  complete(
    id: string,
    result: {
      winner?: string;
      lift: number;
      confidence: number;
      recommendation: string;
    },
  ) {
    const item = this.experiments.get(id);
    if (!item) return undefined;
    item.status = "completed";
    item.result = result;
    return this.clone(item);
  }

  list() {
    return [...this.experiments.values()].map((item) => this.clone(item));
  }

  health() {
    return {
      status: "operational",
      experiments: this.experiments.size,
      hypothesisDriven: true,
      controlledExecution: true,
      confidenceEvaluation: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(value: ExperimentPlan): ExperimentPlan {
    return JSON.parse(JSON.stringify(value)) as ExperimentPlan;
  }
}