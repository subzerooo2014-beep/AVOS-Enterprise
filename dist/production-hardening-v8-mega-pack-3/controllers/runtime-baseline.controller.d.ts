import { CaptureRuntimeBaselineDto } from "../dto";
import { RuntimeBaselineService } from "../services/runtime-baseline.service";
export declare class RuntimeBaselineController {
    private readonly baselines;
    constructor(baselines: RuntimeBaselineService);
    capture(dto: CaptureRuntimeBaselineDto): import("..").RuntimeBaseline;
    list(): import("..").RuntimeBaseline[];
    get(id: string): import("..").RuntimeBaseline;
    verify(id: string): {
        valid: boolean;
        baselineId: string;
        storedHash: string;
        calculatedHash: string;
        verifiedAt: string;
    };
}
