import { GovernanceActor, GovernanceAuditEntry, GovernanceAuditEventType, GovernanceIntegrityResult, GovernanceJsonValue } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeGovernanceAuditService {
    private readonly store;
    private static readonly GENESIS_HASH;
    constructor(store: RuntimeGovernanceStore);
    append(input: {
        type: GovernanceAuditEventType;
        aggregateType: string;
        aggregateId: string;
        actor: GovernanceActor;
        payload: Record<string, GovernanceJsonValue>;
        metadata?: Record<string, GovernanceJsonValue>;
    }): GovernanceAuditEntry;
    list(): GovernanceAuditEntry[];
    verify(): GovernanceIntegrityResult;
    private failure;
}
