import { RuntimeExecutionSnapshot } from "../contracts";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeExecutionEvidenceService } from "./runtime-execution-evidence.service";
export declare class RuntimeExecutionStatusService {
    private readonly store;
    private readonly evidence;
    constructor(store: RuntimeGovernanceStore, evidence: RuntimeExecutionEvidenceService);
    snapshot(): RuntimeExecutionSnapshot;
}
