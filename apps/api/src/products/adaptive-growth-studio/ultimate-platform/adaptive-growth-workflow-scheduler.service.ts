import { Injectable } from "@nestjs/common";

@Injectable()
export class AdaptiveGrowthWorkflowSchedulerService {
  private readonly schedules = new Map<string, {
    id: string;
    workflowId: string;
    dueAt: string;
    status: "scheduled" | "released" | "cancelled";
  }>();

  schedule(workflowId: string, dueAt: string) {
    const id = `ags-schedule:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    const item = {
      id,
      workflowId,
      dueAt,
      status: "scheduled" as const,
    };

    this.schedules.set(id, item);
    return item;
  }

  list() {
    return [...this.schedules.values()];
  }

  status() {
    return {
      status: "operational",
      schedules: this.schedules.size,
      timeoutManagementReady: true,
      delayedExecutionReady: true,
    };
  }
}