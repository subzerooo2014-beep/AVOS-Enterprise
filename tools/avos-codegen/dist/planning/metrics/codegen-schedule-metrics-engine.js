"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenScheduleMetricsEngine = void 0;
class CodeGenScheduleMetricsEngine {
    calculate(schedule) {
        const items = schedule.items.length;
        const maximumConcurrency = schedule.stages.length > 0
            ? Math.max(...schedule.stages.map((stage) => stage.concurrency))
            : 0;
        const serialWeight = schedule.totalWeight;
        const parallelWeight = schedule.stages.reduce((total, stage) => total +
            Math.ceil(stage.estimatedWeight /
                Math.max(1, stage.concurrency)), 0);
        const estimatedEfficiency = serialWeight === 0
            ? 1
            : Math.min(1, serialWeight /
                Math.max(1, parallelWeight *
                    Math.max(1, maximumConcurrency)));
        return {
            items,
            stages: schedule.stages.length,
            totalWeight: schedule.totalWeight,
            averageWeight: items === 0
                ? 0
                : schedule.totalWeight /
                    items,
            maximumConcurrency,
            readyItems: schedule.items.filter((item) => item.status ===
                "ready").length,
            pendingItems: schedule.items.filter((item) => item.status ===
                "pending").length,
            estimatedEfficiency,
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenScheduleMetricsEngine = CodeGenScheduleMetricsEngine;
//# sourceMappingURL=codegen-schedule-metrics-engine.js.map