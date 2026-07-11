import { CreateGovernanceArchiveDto } from "../dto";
import { RuntimeGovernanceArchiveService } from "../services";
export declare class RuntimeGovernanceArchiveController {
    private readonly archives;
    constructor(archives: RuntimeGovernanceArchiveService);
    create(dto: CreateGovernanceArchiveDto): import("..").GovernanceArchive;
    list(): import("..").GovernanceArchive[];
    get(id: string): import("..").GovernanceArchive;
    verify(id: string): import("..").GovernanceArchiveVerification;
}
