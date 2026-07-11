import { RuntimeResilienceSnapshot } from "../contracts/runtime-resilience.contracts";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
export declare class RuntimeResilienceStatusService {
    private readonly store;
    private readonly evidence;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService);
    snapshot(): RuntimeResilienceSnapshot;
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
