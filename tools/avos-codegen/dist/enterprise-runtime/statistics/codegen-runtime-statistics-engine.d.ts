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
export declare class CodeGenRuntimeStatisticsEngine {
    calculate(input: {
        totalTasks: number;
        succeededTasks: number;
        failedTasks: number;
        skippedTasks: number;
        totalDurationMs: number;
    }): CodeGenRuntimeStatistics;
}
//# sourceMappingURL=codegen-runtime-statistics-engine.d.ts.map