import { GovernanceCheckpoint, GovernanceCheckpointVerification } from "../contracts";
import { CreateGovernanceCheckpointDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceSnapshotBuilderService } from "./runtime-governance-snapshot-builder.service";
export declare class RuntimeGovernanceCheckpointService {
    private readonly store;
    private readonly snapshots;
    constructor(store: RuntimeGovernanceStore, snapshots: RuntimeGovernanceSnapshotBuilderService);
    create(dto: CreateGovernanceCheckpointDto): GovernanceCheckpoint;
    verify(id: string): GovernanceCheckpointVerification;
    markRestoreReady(id: string): GovernanceCheckpoint;
    list(): GovernanceCheckpoint[];
    get(id: string): GovernanceCheckpoint;
    private expireCheckpoints;
    private nextCheckpointNumber;
}
