export declare class CreateTrafficPolicyDto {
    serviceName: string;
    environment?: string;
    name: string;
    triggerCpuPercent?: number;
    triggerMemoryPercent?: number;
    triggerLatencyMs?: number;
    triggerErrorRatePercent?: number;
    triggerQueueDepth?: number;
    maximumRequestsPerMinute?: number;
    action?: "none" | "monitor" | "throttle" | "shed_load" | "queue_requests" | "disable_noncritical_features" | "block_deployments" | "scale_out";
}
