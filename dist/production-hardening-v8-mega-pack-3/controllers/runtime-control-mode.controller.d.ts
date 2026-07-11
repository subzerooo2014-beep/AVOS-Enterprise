import { ChangeRuntimeControlModeDto } from "../dto";
import { RuntimeControlModeService } from "../services/runtime-control-mode.service";
export declare class RuntimeControlModeController {
    private readonly controlMode;
    constructor(controlMode: RuntimeControlModeService);
    get(): {
        controlMode: import("..").RuntimeControlMode;
        observedAt: string;
    };
    change(dto: ChangeRuntimeControlModeDto): {
        previousControlMode: import("..").RuntimeControlMode;
        controlMode: import("..").RuntimeControlMode;
        changedAt: string;
    };
}
