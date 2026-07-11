export interface CodeGenPerformanceMeasurement {
    name: string;
    count: number;
    totalMs: number;
    averageMs: number;
    minimumMs: number;
    maximumMs: number;
}
export declare class CodeGenRuntimePerformanceMonitor {
    private readonly measurements;
    record(name: string, durationMs: number): void;
    measure<T>(name: string, operation: () => Promise<T>): Promise<T>;
    report(): CodeGenPerformanceMeasurement[];
    clear(): void;
}
//# sourceMappingURL=codegen-runtime-performance-monitor.d.ts.map