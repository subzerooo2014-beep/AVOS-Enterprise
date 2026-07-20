import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GrowthExperiment,
} from "../contracts/agp-growth-commercial.contracts";

@Injectable()
export class AgpExperimentationService {
  private readonly experiments = new Map<string, GrowthExperiment>();

  create(input: {
    name: string;
    hypothesis: string;
    primaryMetric: string;
    variants: Array<{ name: string; allocation: number }>;
    confidenceThreshold?: number;
  }): GrowthExperiment {
    const experiment: GrowthExperiment = {
      id: `agp-experiment:${randomUUID()}`,
      name: input.name,
      hypothesis: input.hypothesis,
      primaryMetric: input.primaryMetric,
      variants: input.variants.map((variant) => ({
        id: `agp-variant:${randomUUID()}`,
        name: variant.name,
        allocation: variant.allocation,
        participants: 0,
        conversions: 0,
        conversionRate: 0,
      })),
      confidenceThreshold: input.confidenceThreshold ?? 0.95,
      status: "draft",
      requiresHumanApproval: true,
      createdAt: new Date().toISOString(),
    };

    this.experiments.set(experiment.id, experiment);
    return this.clone(experiment);
  }

  start(id: string, approvedBy: string): GrowthExperiment {
    const experiment = this.require(id);
    if (!approvedBy?.trim()) {
      throw new Error("Human approval is required to start an experiment.");
    }
    experiment.status = "running";
    experiment.approvedBy = approvedBy;
    return this.clone(experiment);
  }

  record(
    id: string,
    variantId: string,
    participants: number,
    conversions: number,
  ): GrowthExperiment {
    const experiment = this.require(id);
    const variant = experiment.variants.find((item) => item.id === variantId);
    if (!variant) {
      throw new NotFoundException(`Variant not found: ${variantId}`);
    }

    variant.participants += participants;
    variant.conversions += conversions;
    variant.conversionRate =
      variant.participants > 0
        ? Number((variant.conversions / variant.participants).toFixed(4))
        : 0;

    return this.clone(experiment);
  }

  complete(id: string, approvedBy: string): GrowthExperiment {
    const experiment = this.require(id);
    if (!approvedBy?.trim()) {
      throw new Error("Human approval is required to complete an experiment.");
    }

    const winner = [...experiment.variants].sort(
      (a, b) => b.conversionRate - a.conversionRate,
    )[0];

    experiment.status = "completed";
    experiment.winnerVariantId = winner?.id;
    experiment.approvedBy = approvedBy;
    experiment.completedAt = new Date().toISOString();
    return this.clone(experiment);
  }

  list(): GrowthExperiment[] {
    return [...this.experiments.values()].map((item) => this.clone(item));
  }

  health() {
    const experiments = this.list();
    return {
      status: "operational",
      total: experiments.length,
      running: experiments.filter((item) => item.status === "running").length,
      completed: experiments.filter((item) => item.status === "completed").length,
      humanFinalAuthority: experiments.every(
        (item) => item.requiresHumanApproval,
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private require(id: string): GrowthExperiment {
    const experiment = this.experiments.get(id);
    if (!experiment) {
      throw new NotFoundException(`Experiment not found: ${id}`);
    }
    return experiment;
  }

  private clone(experiment: GrowthExperiment): GrowthExperiment {
    return JSON.parse(JSON.stringify(experiment)) as GrowthExperiment;
  }
}