import { AppendEvidenceChainDto } from "./dto/append-evidence-chain.dto";
import { EvidenceChainService } from "./evidence-chain.service";
export declare class EvidenceChainController {
    private readonly evidence;
    constructor(evidence: EvidenceChainService);
    append(dto: AppendEvidenceChainDto): Promise<import("./automation.types").EvidenceChainEntry>;
    list(): Promise<import("./automation.types").EvidenceChainEntry[]>;
    latest(): Promise<import("./automation.types").EvidenceChainEntry | null>;
    verify(): Promise<import("./automation.types").EvidenceChainVerification>;
}
