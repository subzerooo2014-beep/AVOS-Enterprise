import { CodeGenExecutionSchedule } from "../scheduling/codegen-scheduling.contracts";
export interface CodeGenScheduleMetrics {
    items: number;
    stages: number;
    totalWeight: number;
    averageWeight: number;
    maximumConcurrency: number;
    readyItems: number;
    pendingItems: number;
    estimatedEfficiency: number;
    generatedAt: string;
}
export declare class CodeGenScheduleMetricsEngine {
    calculate(schedule: CodeGenExecutionSchedule): CodeGenScheduleMetrics;
}
//# sourceMappingURL=codegen-schedule-metrics-engine.d.ts.map