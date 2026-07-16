import { Injectable } from "@nestjs/common";
import { PortfolioPrioritizationService } from "./portfolio-prioritization.service";
import type { StrategyExecutionRecord } from "./enterprise-strategic-planning-simulation.types";

@Injectable()
export class StrategyExecutionTrackerService {
  private readonly executions = new Map<string, StrategyExecutionRecord>();

  constructor(
    private readonly portfolio: PortfolioPrioritizationService,
  ) {}

  update(
    initiativeId: string,
    progressPercent: number,
    milestone: string,
    status: StrategyExecutionRecord["status"],
  ): StrategyExecutionRecord {
    this.portfolio
      .list()
      .find((initiative) => initiative.id === initiativeId) ??
      (() => {
        throw new Error(
          `Portfolio initiative '${initiativeId}' was not found.`,
        );
      })();

    const execution: StrategyExecutionRecord = {
      id: `strategy-execution-${initiativeId}`,
      initiativeId,
      progressPercent,
      milestone,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.executions.set(execution.id, execution);
    return { ...execution };
  }

  list(): StrategyExecutionRecord[] {
    return Array.from(this.executions.values()).map((item) => ({
      ...item,
    }));
  }

  count(): number {
    return this.executions.size;
  }

  blockedCount(): number {
    return this.list().filter((item) => item.status === "BLOCKED").length;
  }
}
