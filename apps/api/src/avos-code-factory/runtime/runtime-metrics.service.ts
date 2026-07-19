import { Injectable } from "@nestjs/common";
import { FactoryExecutionResult } from "../contracts/factory.contracts";

@Injectable()
export class RuntimeMetricsService {
  snapshot(records: FactoryExecutionResult[]) {
    const durations = records
      .map((item) => item.durationMs)
      .filter((value): value is number => typeof value === "number");

    return {
      totalExecutions: records.length,
      activeExecutions: records.filter((item) => item.status === "running" || item.status === "queued").length,
      completedExecutions: records.filter((item) => item.status === "completed").length,
      failedExecutions: records.filter((item) => item.status === "failed").length,
      averageDurationMs: durations.length
        ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
        : 0,
      generatedAt: new Date().toISOString(),
    };
  }
}
