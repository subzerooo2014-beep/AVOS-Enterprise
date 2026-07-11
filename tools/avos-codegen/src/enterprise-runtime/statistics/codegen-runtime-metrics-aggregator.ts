import {
  CodeGenExecutionBatchResult,
} from "../execution/contracts/codegen-execution-task.contracts";
import {
  CodeGenExecutionProgress,
} from "../progress/codegen-progress.contracts";
import {
  CodeGenRuntimeStatistics,
  CodeGenRuntimeStatisticsEngine,
} from "./codegen-runtime-statistics-engine";
import {
  CodeGenTelemetrySnapshot,
} from "../telemetry/codegen-telemetry.contracts";
import {
  CodeGenPerformanceMeasurement,
} from "../telemetry/codegen-runtime-performance-monitor";

export interface CodeGenRuntimeMetricsReport {
  progress:
    CodeGenExecutionProgress;
  statistics:
    CodeGenRuntimeStatistics;
  telemetry:
    CodeGenTelemetrySnapshot;
  performance:
    CodeGenPerformanceMeasurement[];
  generatedAt: string;
}

export class CodeGenRuntimeMetricsAggregator {
  constructor(
    readonly statistics =
      new CodeGenRuntimeStatisticsEngine(),
  ) {}

  aggregate(
    input: {
      batch:
        CodeGenExecutionBatchResult;
      progress:
        CodeGenExecutionProgress;
      telemetry:
        CodeGenTelemetrySnapshot;
      performance:
        CodeGenPerformanceMeasurement[];
    },
  ): CodeGenRuntimeMetricsReport {
    return {
      progress:
        structuredClone(
          input.progress,
        ),
      statistics:
        this.statistics.calculate({
          totalTasks:
            input.batch.results.length,
          succeededTasks:
            input.batch.succeeded,
          failedTasks:
            input.batch.failed,
          skippedTasks:
            input.batch.skipped,
          totalDurationMs:
            input.batch.durationMs,
        }),
      telemetry:
        structuredClone(
          input.telemetry,
        ),
      performance:
        structuredClone(
          input.performance,
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }
}
