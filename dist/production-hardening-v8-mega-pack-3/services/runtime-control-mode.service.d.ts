import { RuntimeControlMode } from "../contracts/runtime-resilience.enums";
import { ChangeRuntimeControlModeDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
export declare class RuntimeControlModeService {
    private readonly store;
    private readonly evidence;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService);
    get(): {
        controlMode: RuntimeControlMode;
        observedAt: string;
    };
    change(dto: ChangeRuntimeControlModeDto): {
        previousControlMode: RuntimeControlMode;
        controlMode: RuntimeControlMode;
        changedAt: string;
    };
}
