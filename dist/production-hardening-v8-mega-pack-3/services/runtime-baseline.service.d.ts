import { RuntimeBaseline } from "../contracts/runtime-resilience.contracts";
import { CaptureRuntimeBaselineDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
export declare class RuntimeBaselineService {
    private readonly store;
    private readonly evidence;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService);
    capture(dto: CaptureRuntimeBaselineDto): RuntimeBaseline;
    list(): RuntimeBaseline[];
    get(id: string): RuntimeBaseline;
    verify(id: string): {
        valid: boolean;
        baselineId: string;
        storedHash: string;
        calculatedHash: string;
        verifiedAt: string;
    };
    private buildSignalSnapshot;
}
