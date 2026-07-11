import { AppendEvidenceChainDto } from "./dto/append-evidence-chain.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { EvidenceChainEntry, EvidenceChainVerification } from "./automation.types";
export declare class EvidenceChainService {
    private readonly storage;
    private readonly sequence;
    constructor(storage: MegaPack6StorageService, sequence: EnterpriseSequenceService);
    append(dto: AppendEvidenceChainDto): Promise<EvidenceChainEntry>;
    list(): Promise<EvidenceChainEntry[]>;
    verify(): Promise<EvidenceChainVerification>;
    latest(): Promise<EvidenceChainEntry | null>;
    private hash;
    private stableStringify;
}
