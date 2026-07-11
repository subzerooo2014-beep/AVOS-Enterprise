"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRuntimeStatisticsEngine = void 0;
class CodeGenRuntimeStatisticsEngine {
    calculate(input) {
        const processed = input.succeededTasks +
            input.failedTasks +
            input.skippedTasks;
        const seconds = input.totalDurationMs /
            1000;
        return {
            totalTasks: input.totalTasks,
            succeededTasks: input.succeededTasks,
            failedTasks: input.failedTasks,
            skippedTasks: input.skippedTasks,
            successRate: processed === 0
                ? 1
                : input.succeededTasks /
                    processed,
            averageDurationMs: processed === 0
                ? 0
                : input.totalDurationMs /
                    processed,
            throughputPerSecond: seconds <= 0
                ? processed
                : processed /
                    seconds,
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenRuntimeStatisticsEngine = CodeGenRuntimeStatisticsEngine;
//# sourceMappingURL=codegen-runtime-statistics-engine.js.map