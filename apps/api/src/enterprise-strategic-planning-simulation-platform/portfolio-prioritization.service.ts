import { Injectable, NotFoundException } from "@nestjs/common";
import { StrategyRegistryService } from "./strategy-registry.service";
import type { PortfolioInitiativeRecord } from "./enterprise-strategic-planning-simulation.types";

@Injectable()
export class PortfolioPrioritizationService {
  private readonly initiatives = new Map<string, PortfolioInitiativeRecord>();

  constructor(private readonly strategies: StrategyRegistryService) {}

  register(
    planId: string,
    name: string,
    strategicValue: number,
    cost: number,
    risk: number,
    urgency: number,
  ): PortfolioInitiativeRecord {
    this.strategies.get(planId);

    const priorityScore = Math.max(
      0,
      Math.min(
        100,
        strategicValue * 0.4 +
          urgency * 0.3 +
          (100 - risk) * 0.2 +
          (100 - Math.min(100, cost)) * 0.1,
      ),
    );

    const now = new Date().toISOString();

    const initiative: PortfolioInitiativeRecord = {
      id: `portfolio-initiative-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      planId,
      name,
      strategicValue,
      cost,
      risk,
      urgency,
      priorityScore,
      status: "PROPOSED",
      createdAt: now,
      updatedAt: now,
    };

    this.initiatives.set(initiative.id, initiative);
    return { ...initiative };
  }

  approve(id: string): PortfolioInitiativeRecord {
    const initiative = this.requireInitiative(id);
    initiative.status = "APPROVED";
    initiative.updatedAt = new Date().toISOString();
    return { ...initiative };
  }

  start(id: string): PortfolioInitiativeRecord {
    const initiative = this.requireInitiative(id);
    initiative.status = "EXECUTING";
    initiative.updatedAt = new Date().toISOString();
    return { ...initiative };
  }

  list(): PortfolioInitiativeRecord[] {
    return Array.from(this.initiatives.values())
      .map((initiative) => ({ ...initiative }))
      .sort((left, right) => right.priorityScore - left.priorityScore);
  }

  count(): number {
    return this.initiatives.size;
  }

  approvedCount(): number {
    return this.list().filter((item) => item.status === "APPROVED").length;
  }

  executingCount(): number {
    return this.list().filter((item) => item.status === "EXECUTING").length;
  }

  private requireInitiative(id: string): PortfolioInitiativeRecord {
    const initiative = this.initiatives.get(id);

    if (!initiative) {
      throw new NotFoundException(
        `Portfolio initiative '${id}' was not found.`,
      );
    }

    return initiative;
  }
}
