import { GovernanceOperationsSnapshot } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
export declare class RuntimeGovernanceOperationsStatusService {
    private readonly store;
    constructor(store: RuntimeGovernanceStore);
    snapshot(): GovernanceOperationsSnapshot;
}
