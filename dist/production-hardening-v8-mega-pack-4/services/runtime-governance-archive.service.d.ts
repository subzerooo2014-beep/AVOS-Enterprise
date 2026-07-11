import { GovernanceArchive, GovernanceArchiveVerification } from "../contracts";
import { CreateGovernanceArchiveDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceCheckpointService } from "./runtime-governance-checkpoint.service";
import { RuntimeGovernanceSnapshotBuilderService } from "./runtime-governance-snapshot-builder.service";
export declare class RuntimeGovernanceArchiveService {
    private readonly store;
    private readonly checkpoints;
    private readonly snapshots;
    constructor(store: RuntimeGovernanceStore, checkpoints: RuntimeGovernanceCheckpointService, snapshots: RuntimeGovernanceSnapshotBuilderService);
    create(dto: CreateGovernanceArchiveDto): GovernanceArchive;
    verify(id: string): GovernanceArchiveVerification;
    list(): GovernanceArchive[];
    get(id: string): GovernanceArchive;
    private resolveArchiveSections;
    private section;
    private nextArchiveNumber;
}
