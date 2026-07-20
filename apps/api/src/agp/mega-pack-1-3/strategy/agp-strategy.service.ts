import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AgpObjective,
  AgpStrategy,
} from "../contracts/agp-strategy.contracts";
import { AgpEventBusService } from "../events/agp-event-bus.service";
import { AgpRegistryService } from "../registry/agp-registry.service";
import { AgpRuntimeService } from "../runtime/agp-runtime.service";

@Injectable()
export class AgpStrategyService {
  private readonly strategies = new Map<string, AgpStrategy>();

  constructor(
    private readonly events: AgpEventBusService,
    private readonly registry: AgpRegistryService,
    private readonly runtime: AgpRuntimeService,
  ) {}

  create(input: {
    name: string;
    vision: string;
    theme: string;
    owner: string;
    dependencies?: string[];
  }): AgpStrategy {
    const now = new Date().toISOString();
    const strategy: AgpStrategy = {
      id: `agp-strategy:${randomUUID()}`,
      name: input.name,
      vision: input.vision,
      theme: input.theme,
      owner: input.owner,
      objectives: [],
      dependencies: input.dependencies ?? [],
      version: 1,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };

    this.strategies.set(strategy.id, strategy);
    this.registry.register({
      type: "strategy",
      name: strategy.name,
      version: String(strategy.version),
      dependencies: strategy.dependencies,
    });
    this.runtime.increment("strategies");
    this.events.publish("agp.strategy.created", strategy, {
      aggregateId: strategy.id,
    });

    return this.clone(strategy);
  }

  addObjective(
    strategyId: string,
    input: Omit<AgpObjective, "id" | "status">,
  ): AgpStrategy {
    const strategy = this.require(strategyId);
    const objective: AgpObjective = {
      ...input,
      id: `agp-objective:${randomUUID()}`,
      status: "draft",
      keyResults: input.keyResults.map((item) => ({ ...item })),
    };

    strategy.objectives.push(objective);
    strategy.version += 1;
    strategy.updatedAt = new Date().toISOString();
    this.events.publish("agp.strategy.objective-added", objective, {
      aggregateId: strategy.id,
    });

    return this.clone(strategy);
  }

  approve(strategyId: string, approvedBy: string): AgpStrategy {
    const strategy = this.require(strategyId);
    strategy.status = "approved";
    strategy.version += 1;
    strategy.updatedAt = new Date().toISOString();

    this.events.publish(
      "agp.strategy.approved",
      { strategyId, approvedBy },
      { aggregateId: strategyId },
    );

    return this.clone(strategy);
  }

  get(strategyId: string): AgpStrategy {
    return this.clone(this.require(strategyId));
  }

  list(): AgpStrategy[] {
    return [...this.strategies.values()].map((strategy) =>
      this.clone(strategy),
    );
  }

  private require(strategyId: string): AgpStrategy {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      throw new NotFoundException(`Strategy not found: ${strategyId}`);
    }
    return strategy;
  }

  private clone(strategy: AgpStrategy): AgpStrategy {
    return JSON.parse(JSON.stringify(strategy)) as AgpStrategy;
  }
}