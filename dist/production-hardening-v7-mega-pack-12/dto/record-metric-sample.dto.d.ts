export declare class RecordMetricSampleDto {
    sloId: string;
    availabilityPercent: number;
    latencyMs: number;
    errorRatePercent: number;
    requests?: number;
    failures?: number;
    cpuPercent?: number;
    memoryPercent?: number;
    queueDepth?: number;
}
