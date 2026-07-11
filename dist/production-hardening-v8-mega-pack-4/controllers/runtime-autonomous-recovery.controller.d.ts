import { ApproveRecoveryPlanDto, CreateRecoveryPlanDto, ExecuteRecoveryPlanDto, GovernanceActorDto } from "../dto";
import { RuntimeAutonomousRecoveryService } from "../services";
export declare class RuntimeAutonomousRecoveryController {
    private readonly recovery;
    constructor(recovery: RuntimeAutonomousRecoveryService);
    create(dto: CreateRecoveryPlanDto): import("..").AutonomousRecoveryPlan;
    list(): import("..").AutonomousRecoveryPlan[];
    get(id: string): import("..").AutonomousRecoveryPlan;
    approve(id: string, dto: ApproveRecoveryPlanDto): import("..").AutonomousRecoveryPlan;
    execute(id: string, dto: ExecuteRecoveryPlanDto): Promise<import("..").AutonomousRecoveryPlan>;
    rollback(id: string, actor: GovernanceActorDto): import("..").AutonomousRecoveryPlan;
}
