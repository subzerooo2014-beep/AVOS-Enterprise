import { EvidenceEntry, EvidenceIntegrityResult, JsonValue, RuntimeActor } from "../contracts/runtime-resilience.contracts";
import { EvidenceEntryType } from "../contracts/runtime-resilience.enums";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
export declare class RuntimeEvidenceChainService {
    private readonly store;
    private static readonly GENESIS_HASH;
    constructor(store: RuntimeResilienceStore);
    append(input: {
        type: EvidenceEntryType;
        aggregateType: string;
        aggregateId: string;
        actor: RuntimeActor;
        payload: Record<string, JsonValue>;
        metadata?: Record<string, JsonValue>;
    }): EvidenceEntry;
    list(): EvidenceEntry[];
    verify(): EvidenceIntegrityResult;
}
