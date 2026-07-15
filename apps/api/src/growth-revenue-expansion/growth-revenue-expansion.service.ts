import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { GROWTH_CAPABILITIES } from "./growth-revenue-expansion.registry";
import {
  GrowthCapability,
  GrowthExperiment,
  GrowthInitiative,
  RevenueOpportunity,
} from "./growth-revenue-expansion.types";

@Injectable()
export class GrowthRevenueExpansionService {
  private readonly initiatives = new Map<string, GrowthInitiative>();
  private readonly experiments = new Map<string, GrowthExperiment>();
  private readonly opportunities = new Map<string, RevenueOpportunity>();
  private readonly codeIndex = new Map<string, string>();

  framework() {
    return {
      system: "AVOS Growth, Revenue & Market Expansion Platform V1",
      status: "READY",
      capabilityCount: Object.keys(GROWTH_CAPABILITIES).length,
      capabilities: structuredClone(GROWTH_CAPABILITIES),
    };
  }

  createInitiative(
    capability: GrowthCapability,
    input: Omit<
      GrowthInitiative,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    if (!GROWTH_CAPABILITIES[capability]) {
      throw new Error(`Unknown growth capability: ${capability}`);
    }

    if (!input.name.trim() || !input.owner.trim()) {
      throw new Error("Initiative name and owner are required");
    }

    if (input.budget < 0 || input.targetValue < 0 || input.currentValue < 0) {
      throw new Error("Budget and metric values cannot be negative");
    }

    const code = `${capability}:${input.code.trim().toUpperCase()}`;

    if (this.codeIndex.has(code)) {
      throw new Error(`Duplicate growth initiative code: ${code}`);
    }

    const now = new Date().toISOString();

    const initiative: GrowthInitiative = {
      ...input,
      id: randomUUID(),
      capability,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      owner: input.owner.trim(),
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.initiatives.set(initiative.id, initiative);
    this.codeIndex.set(code, initiative.id);

    return { ...initiative };
  }

  activateInitiative(id: string) {
    const initiative = this.requireInitiative(id);
    initiative.status = "ACTIVE";
    initiative.updatedAt = new Date().toISOString();
    this.initiatives.set(id, initiative);

    return { ...initiative };
  }

  updateProgress(id: string, currentValue: number) {
    const initiative = this.requireInitiative(id);

    if (currentValue < 0) {
      throw new Error("Current value cannot be negative");
    }

    initiative.currentValue = currentValue;
    initiative.updatedAt = new Date().toISOString();

    if (currentValue >= initiative.targetValue) {
      initiative.status = "COMPLETED";
    }

    this.initiatives.set(id, initiative);
    return { ...initiative };
  }

  createExperiment(
    initiativeId: string,
    input: Omit<
      GrowthExperiment,
      "id" | "initiativeId" | "winner" | "status" | "createdAt" | "completedAt"
    >,
  ) {
    const initiative = this.requireInitiative(initiativeId);

    if (initiative.status !== "ACTIVE") {
      throw new Error("Initiative must be active before creating experiments");
    }

    const experiment: GrowthExperiment = {
      ...input,
      id: randomUUID(),
      initiativeId,
      winner: "INCONCLUSIVE",
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    };

    this.experiments.set(experiment.id, experiment);
    return { ...experiment };
  }

  completeExperiment(
    id: string,
    input: {
      controlValue: number;
      variantValue: number;
      confidence: number;
    },
  ) {
    const experiment = this.requireExperiment(id);

    if (input.confidence < 0 || input.confidence > 100) {
      throw new Error("Confidence must be between 0 and 100");
    }

    experiment.controlValue = input.controlValue;
    experiment.variantValue = input.variantValue;
    experiment.confidence = input.confidence;
    experiment.winner =
      input.confidence < 90
        ? "INCONCLUSIVE"
        : input.variantValue > input.controlValue
          ? "VARIANT"
          : "CONTROL";
    experiment.status = "COMPLETED";
    experiment.completedAt = new Date().toISOString();

    this.experiments.set(id, experiment);
    return { ...experiment };
  }

  createRevenueOpportunity(
    input: Omit<
      RevenueOpportunity,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    if (input.estimatedValue < 0) {
      throw new Error("Estimated value cannot be negative");
    }

    if (input.probability < 0 || input.probability > 100) {
      throw new Error("Probability must be between 0 and 100");
    }

    const now = new Date().toISOString();

    const opportunity: RevenueOpportunity = {
      ...input,
      id: randomUUID(),
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
    };

    this.opportunities.set(opportunity.id, opportunity);
    return { ...opportunity };
  }

  updateOpportunityStatus(
    id: string,
    status: RevenueOpportunity["status"],
  ) {
    const opportunity = this.requireOpportunity(id);
    opportunity.status = status;
    opportunity.updatedAt = new Date().toISOString();
    this.opportunities.set(id, opportunity);

    return { ...opportunity };
  }

  listInitiatives(
    capability?: GrowthCapability,
    tenantId?: string,
  ) {
    return Array.from(this.initiatives.values())
      .filter((item) => !capability || item.capability === capability)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => ({ ...item }));
  }

  commandCenter() {
    const initiatives = Array.from(this.initiatives.values());
    const experiments = Array.from(this.experiments.values());
    const opportunities = Array.from(this.opportunities.values());

    const wonRevenue = opportunities
      .filter((item) => item.status === "WON")
      .reduce((sum, item) => sum + item.estimatedValue, 0);

    const weightedPipeline = opportunities
      .filter((item) => ["OPEN", "ACCEPTED"].includes(item.status))
      .reduce(
        (sum, item) =>
          sum + item.estimatedValue * (item.probability / 100),
        0,
      );

    return {
      system: "AVOS Growth, Revenue & Market Expansion Platform V1",
      capabilities: Object.keys(GROWTH_CAPABILITIES).length,
      initiatives: initiatives.length,
      activeInitiatives: initiatives.filter(
        (item) => item.status === "ACTIVE",
      ).length,
      completedInitiatives: initiatives.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      experiments: experiments.length,
      completedExperiments: experiments.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      revenueOpportunities: opportunities.length,
      wonRevenue: Number(wonRevenue.toFixed(2)),
      weightedPipeline: Number(weightedPipeline.toFixed(2)),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireInitiative(id: string) {
    const initiative = this.initiatives.get(id);

    if (!initiative) {
      throw new Error(`Growth initiative not found: ${id}`);
    }

    return initiative;
  }

  private requireExperiment(id: string) {
    const experiment = this.experiments.get(id);

    if (!experiment) {
      throw new Error(`Growth experiment not found: ${id}`);
    }

    return experiment;
  }

  private requireOpportunity(id: string) {
    const opportunity = this.opportunities.get(id);

    if (!opportunity) {
      throw new Error(`Revenue opportunity not found: ${id}`);
    }

    return opportunity;
  }
}