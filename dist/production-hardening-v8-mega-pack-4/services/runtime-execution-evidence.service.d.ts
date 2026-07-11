import { GovernanceActor, GovernanceJsonValue, RuntimeExecutionEvidence, RuntimeExecutionEvidenceType } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeExecutionEvidenceService {
    private readonly store;
    private static readonly GENESIS_HASH;
    constructor(store: RuntimeGovernanceStore);
    append(input: {
        changeExecutionId: string;
        runbookExecutionId?: string;
        stepExecutionId?: string;
        type: RuntimeExecutionEvidenceType;
        actor: GovernanceActor;
        payload: Record<string, GovernanceJsonValue>;
    }): RuntimeExecutionEvidence;
    list(): RuntimeExecutionEvidence[];
    verify(): {
        valid: boolean;
        checkedEntries: number;
        brokenSequence?: number;
        expectedHash?: string;
        actualHash?: string;
        verifiedAt: string;
    };
}
