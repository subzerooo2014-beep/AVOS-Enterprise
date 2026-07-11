import { RuntimeGovernanceDataLifecycleStatusService } from "../services";
export declare class RuntimeGovernanceDataLifecycleController {
    private readonly status;
    constructor(status: RuntimeGovernanceDataLifecycleStatusService);
    snapshot(): import("..").GovernanceDataLifecycleSnapshot;
}
