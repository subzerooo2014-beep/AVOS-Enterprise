import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";

@Injectable()
export class AdaptiveGrowthMetricsService {
  constructor(private readonly store: AdaptiveGrowthUltimateStoreService) {}

  snapshot() {
    const workflows = [...this.store.workflows.values()];
    const invocations = [...this.store.invocations.values()];
    const tasks = [...this.store.tasks.values()];

    const completedWorkflows = workflows.filter((item) => item.state === "completed").length;
    const workflowSuccessRate =
      workflows.length === 0 ? 1 : completedWorkflows / workflows.length;

    return {
      workflowCount: workflows.length,
      workflowSuccessRate: Number(workflowSuccessRate.toFixed(4)),
      invocationCount: invocations.length,
      completedInvocations: invocations.filter((item) => item.status === "completed").length,
      agentTaskCount: tasks.length,
      telemetryEvents: this.store.telemetry.length,
      alerts: this.store.alerts.size,
      outcomes: this.store.outcomes.size,
      strategies: this.store.strategies.size,
      measuredAt: new Date().toISOString(),
    };
  }
}