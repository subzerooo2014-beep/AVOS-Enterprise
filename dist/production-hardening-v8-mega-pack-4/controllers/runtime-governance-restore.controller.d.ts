import { CreateGovernanceRestorePlanDto, ExecuteGovernanceRestorePlanDto } from "../dto";
import { RuntimeGovernanceRestoreService } from "../services";
export declare class RuntimeGovernanceRestoreController {
    private readonly restores;
    constructor(restores: RuntimeGovernanceRestoreService);
    create(dto: CreateGovernanceRestorePlanDto): import("..").GovernanceRestorePlan;
    list(): import("..").GovernanceRestorePlan[];
    get(id: string): import("..").GovernanceRestorePlan;
    validate(id: string): import("..").GovernanceRestorePlan;
    execute(id: string, dto: ExecuteGovernanceRestorePlanDto): import("..").GovernanceRestorePlan;
}
