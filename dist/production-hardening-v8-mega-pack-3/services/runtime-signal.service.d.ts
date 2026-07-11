import { RuntimeSignal } from "../contracts/runtime-resilience.contracts";
import { RuntimeSignalStatus } from "../contracts/runtime-resilience.enums";
import { RecordRuntimeSignalDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
export declare class RuntimeSignalService {
    private readonly store;
    private readonly evidence;
    constructor(store: RuntimeResilienceStore, evidence: RuntimeEvidenceChainService);
    record(dto: RecordRuntimeSignalDto): RuntimeSignal;
    list(filters?: {
        environment?: string;
        namespace?: string;
        service?: string;
        status?: RuntimeSignalStatus;
    }): RuntimeSignal[];
    get(id: string): RuntimeSignal;
    summarize(filters?: {
        environment?: string;
        namespace?: string;
        service?: string;
    }): {
        total: number;
        healthy: number;
        degraded: number;
        unhealthy: number;
        unknown: number;
        latestObservedAt?: string;
    };
}
