export interface CodeGenRuntimeStatistics {
  totalTasks: number;
  succeededTasks: number;
  failedTasks: number;
  skippedTasks: number;
  successRate: number;
  averageDurationMs: number;
  throughputPerSecond: number;
  generatedAt: string;
}

export class CodeGenRuntimeStatisticsEngine {
  calculate(
    input: {
      totalTasks: number;
      succeededTasks: number;
      failedTasks: number;
      skippedTasks: number;
      totalDurationMs: number;
    },
  ): CodeGenRuntimeStatistics {
    const processed =
      input.succeededTasks +
      input.failedTasks +
      input.skippedTasks;

    const seconds =
      input.totalDurationMs /
      1000;

    return {
      totalTasks:
        input.totalTasks,
      succeededTasks:
        input.succeededTasks,
      failedTasks:
        input.failedTasks,
      skippedTasks:
        input.skippedTasks,
      successRate:
        processed === 0
          ? 1
          : input.succeededTasks /
            processed,
      averageDurationMs:
        processed === 0
          ? 0
          : input.totalDurationMs /
            processed,
      throughputPerSecond:
        seconds <= 0
          ? processed
          : processed /
            seconds,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
