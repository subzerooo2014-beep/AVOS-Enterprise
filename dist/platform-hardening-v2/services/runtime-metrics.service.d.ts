import { RuntimeMetrics } from "../interfaces/runtime-metrics.interface";
export declare class RuntimeMetricsService {
    getMetrics(): Promise<RuntimeMetrics>;
    private sampleEventLoopDelay;
}
