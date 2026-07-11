import { RuntimeEvidenceChainService } from "../services/runtime-evidence-chain.service";
export declare class RuntimeEvidenceController {
    private readonly evidence;
    constructor(evidence: RuntimeEvidenceChainService);
    list(): import("..").EvidenceEntry[];
    verify(): import("..").EvidenceIntegrityResult;
}
