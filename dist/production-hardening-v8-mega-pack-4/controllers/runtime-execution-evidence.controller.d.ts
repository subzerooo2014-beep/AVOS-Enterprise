import { RuntimeExecutionEvidenceService, RuntimeExecutionStatusService } from "../services";
export declare class RuntimeExecutionEvidenceController {
    private readonly evidence;
    private readonly status;
    constructor(evidence: RuntimeExecutionEvidenceService, status: RuntimeExecutionStatusService);
    listEvidence(): import("..").RuntimeExecutionEvidence[];
    verifyEvidence(): {
        valid: boolean;
        checkedEntries: number;
        brokenSequence?: number;
        expectedHash?: string;
        actualHash?: string;
        verifiedAt: string;
    };
    snapshot(): import("..").RuntimeExecutionSnapshot;
}
