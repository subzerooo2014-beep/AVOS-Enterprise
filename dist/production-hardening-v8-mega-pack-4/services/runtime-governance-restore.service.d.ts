import { GovernanceRestorePlan } from "../contracts";
import { CreateGovernanceRestorePlanDto, ExecuteGovernanceRestorePlanDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceArchiveService } from "./runtime-governance-archive.service";
import { RuntimeGovernanceCheckpointService } from "./runtime-governance-checkpoint.service";
export declare class RuntimeGovernanceRestoreService {
    private readonly store;
    private readonly archives;
    private readonly checkpoints;
    constructor(store: RuntimeGovernanceStore, archives: RuntimeGovernanceArchiveService, checkpoints: RuntimeGovernanceCheckpointService);
    create(dto: CreateGovernanceRestorePlanDto): GovernanceRestorePlan;
    validate(id: string): GovernanceRestorePlan;
    execute(id: string, dto: ExecuteGovernanceRestorePlanDto): GovernanceRestorePlan;
    list(): GovernanceRestorePlan[];
    get(id: string): GovernanceRestorePlan;
    private resolveSource;
    private validation;
    private nextRestoreNumber;
}
