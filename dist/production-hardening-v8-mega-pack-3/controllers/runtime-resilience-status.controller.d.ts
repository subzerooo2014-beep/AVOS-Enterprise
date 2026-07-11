import { RuntimeResilienceStatusService } from "../services/runtime-resilience-status.service";
export declare class RuntimeResilienceStatusController {
    private readonly status;
    constructor(status: RuntimeResilienceStatusService);
    snapshot(): import("..").RuntimeResilienceSnapshot;
    health(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "healthy" | "degraded" | "unhealthy";
        evidenceChainVerified: boolean;
        controlMode: string;
        generatedAt: string;
    };
}
