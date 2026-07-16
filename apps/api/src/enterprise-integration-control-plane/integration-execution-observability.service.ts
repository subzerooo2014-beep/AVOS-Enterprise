import { Injectable } from "@nestjs/common";
import type { IntegrationExecutionRecord } from "./enterprise-integration-control-plane.types";

@Injectable()
export class IntegrationExecutionObservabilityService {
  private readonly executions: IntegrationExecutionRecord[] = [];

  begin(routeId: string, providerId?: string): IntegrationExecutionRecord {
    const record: IntegrationExecutionRecord = {
      id: `integration-exec-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      routeId,
      providerId,
      status: "STARTED",
      attempts: 1,
      startedAt: new Date().toISOString(),
    };

    this.executions.unshift(record);
    if (this.executions.length > 1000) this.executions.length = 1000;
    return { ...record };
  }

  complete(id: string): void {
    const record = this.executions.find((item) => item.id === id);
    if (!record) return;

    const completedAt = new Date();
    record.status = "COMPLETED";
    record.completedAt = completedAt.toISOString();
    record.durationMs =
      completedAt.getTime() - new Date(record.startedAt).getTime();
  }

  fail(id: string, error: string): void {
    const record = this.executions.find((item) => item.id === id);
    if (!record) return;

    const completedAt = new Date();
    record.status = "FAILED";
    record.error = error;
    record.completedAt = completedAt.toISOString();
    record.durationMs =
      completedAt.getTime() - new Date(record.startedAt).getTime();
  }

  list(): IntegrationExecutionRecord[] {
    return this.executions.map((item) => ({ ...item }));
  }

  analytics() {
    const completed = this.executions.filter(
      (item) => item.status === "COMPLETED",
    );
    const durations = completed.map((item) => item.durationMs ?? 0);

    return {
      executions: this.executions.length,
      completed: completed.length,
      failed: this.executions.filter((item) => item.status === "FAILED").length,
      averageDurationMs:
        durations.length === 0
          ? 0
          : Math.round(
              durations.reduce((sum, value) => sum + value, 0) /
                durations.length,
            ),
    };
  }
}
