import { CreateGovernanceCheckpointDto } from "../dto";
import { RuntimeGovernanceCheckpointService } from "../services";
export declare class RuntimeGovernanceCheckpointController {
    private readonly checkpoints;
    constructor(checkpoints: RuntimeGovernanceCheckpointService);
    create(dto: CreateGovernanceCheckpointDto): import("..").GovernanceCheckpoint;
    list(): import("..").GovernanceCheckpoint[];
    get(id: string): import("..").GovernanceCheckpoint;
    verify(id: string): import("..").GovernanceCheckpointVerification;
    restoreReady(id: string): import("..").GovernanceCheckpoint;
}
