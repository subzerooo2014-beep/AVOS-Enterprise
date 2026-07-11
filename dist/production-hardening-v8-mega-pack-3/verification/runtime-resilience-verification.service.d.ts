import { RuntimeResilienceSnapshot } from "../contracts/runtime-resilience.contracts";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "../services/runtime-evidence-chain.service";
import { RuntimeResilienceStatusService } from "../services/runtime-resilience-status.service";
export interface RuntimeVerificationCheck {
    name: string;
    success: boolean;
    expected: unknown;
    actual: unknown;
}
export interface RuntimeVerificationResult {
    success: boolean;
    system: string;
    version: string;
    healthStatus: string;
    evidenceChainVerified: boolean;
    checksPassed: number;
    checksFailed: number;
    checks: RuntimeVerificationCheck[];
    snapshot: RuntimeResilienceSnapshot;
    verifiedAt: string;
}
export declare class RuntimeResilienceVerificationService {
    private readonly store;
    private readonly evidence;
    private readonly status;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService, status: RuntimeResilienceStatusService);
    verify(): RuntimeVerificationResult;
    private check;
}
