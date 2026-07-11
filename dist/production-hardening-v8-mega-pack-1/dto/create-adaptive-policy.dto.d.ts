export declare class CreateAdaptivePolicyDto {
    name: string;
    serviceName: string;
    environment?: string;
    minimumHealthScore?: number;
    maximumCpuPercent?: number;
    maximumMemoryPercent?: number;
    maximumLatencyMs?: number;
    maximumErrorRatePercent?: number;
    scaleUpThresholdPercent?: number;
    scaleDownThresholdPercent?: number;
    minimumCapacityUnits?: number;
    maximumCapacityUnits?: number;
    automaticExecution?: boolean;
}
