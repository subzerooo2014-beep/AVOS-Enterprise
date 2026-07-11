import { CodeGenExecutionBatchResult } from "../execution/contracts/codegen-execution-task.contracts";
import { CodeGenExecutionProgress } from "../progress/codegen-progress.contracts";
import { CodeGenRuntimeStatistics, CodeGenRuntimeStatisticsEngine } from "./codegen-runtime-statistics-engine";
import { CodeGenTelemetrySnapshot } from "../telemetry/codegen-telemetry.contracts";
import { CodeGenPerformanceMeasurement } from "../telemetry/codegen-runtime-performance-monitor";
export interface CodeGenRuntimeMetricsReport {
    progress: CodeGenExecutionProgress;
    statistics: CodeGenRuntimeStatistics;
    telemetry: CodeGenTelemetrySnapshot;
    performance: CodeGenPerformanceMeasurement[];
    generatedAt: string;
}
export declare class CodeGenRuntimeMetricsAggregator {
    readonly statistics: CodeGenRuntimeStatisticsEngine;
    constructor(statistics?: CodeGenRuntimeStatisticsEngine);
    aggregate(input: {
        batch: CodeGenExecutionBatchResult;
        progress: CodeGenExecutionProgress;
        telemetry: CodeGenTelemetrySnapshot;
        performance: CodeGenPerformanceMeasurement[];
    }): CodeGenRuntimeMetricsReport;
}
//# sourceMappingURL=codegen-runtime-metrics-aggregator.d.ts.map