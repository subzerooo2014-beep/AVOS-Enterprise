"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRuntimeMetricsAggregator = void 0;
const codegen_runtime_statistics_engine_1 = require("./codegen-runtime-statistics-engine");
class CodeGenRuntimeMetricsAggregator {
    statistics;
    constructor(statistics = new codegen_runtime_statistics_engine_1.CodeGenRuntimeStatisticsEngine()) {
        this.statistics = statistics;
    }
    aggregate(input) {
        return {
            progress: structuredClone(input.progress),
            statistics: this.statistics.calculate({
                totalTasks: input.batch.results.length,
                succeededTasks: input.batch.succeeded,
                failedTasks: input.batch.failed,
                skippedTasks: input.batch.skipped,
                totalDurationMs: input.batch.durationMs,
            }),
            telemetry: structuredClone(input.telemetry),
            performance: structuredClone(input.performance),
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenRuntimeMetricsAggregator = CodeGenRuntimeMetricsAggregator;
//# sourceMappingURL=codegen-runtime-metrics-aggregator.js.map