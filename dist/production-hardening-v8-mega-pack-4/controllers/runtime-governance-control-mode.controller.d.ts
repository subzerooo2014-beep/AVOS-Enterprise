import { ChangeGovernanceControlModeDto } from "../dto";
import { RuntimeGovernanceControlModeService } from "../services";
export declare class RuntimeGovernanceControlModeController {
    private readonly controlMode;
    constructor(controlMode: RuntimeGovernanceControlModeService);
    get(): {
        controlMode: import("..").GovernanceControlMode;
        observedAt: string;
    };
    change(dto: ChangeGovernanceControlModeDto): {
        previousControlMode: import("..").GovernanceControlMode;
        controlMode: import("..").GovernanceControlMode;
        changedAt: string;
    };
}
