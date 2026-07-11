import { GovernanceControlMode } from "../contracts";
import { ChangeGovernanceControlModeDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeGovernanceControlModeService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    get(): {
        controlMode: GovernanceControlMode;
        observedAt: string;
    };
    change(dto: ChangeGovernanceControlModeDto): {
        previousControlMode: GovernanceControlMode;
        controlMode: GovernanceControlMode;
        changedAt: string;
    };
}
