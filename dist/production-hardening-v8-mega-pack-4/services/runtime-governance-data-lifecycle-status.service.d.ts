import { GovernanceDataLifecycleSnapshot } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeGovernanceDataLifecycleStatusService {
    private readonly store;
    constructor(store: RuntimeGovernanceStore);
    snapshot(): GovernanceDataLifecycleSnapshot;
}
