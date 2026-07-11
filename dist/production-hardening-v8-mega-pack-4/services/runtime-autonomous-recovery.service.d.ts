import { AutonomousRecoveryPlan } from "../contracts";
import { ApproveRecoveryPlanDto, CreateRecoveryPlanDto, ExecuteRecoveryPlanDto } from "../dto";
import { RuntimeGovernanceStore } from "../stores/runtime-governance.store";
import { RuntimeGovernanceAuditService } from "./runtime-governance-audit.service";
export declare class RuntimeAutonomousRecoveryService {
    private readonly store;
    private readonly audit;
    constructor(store: RuntimeGovernanceStore, audit: RuntimeGovernanceAuditService);
    create(dto: CreateRecoveryPlanDto): AutonomousRecoveryPlan;
    list(): AutonomousRecoveryPlan[];
    get(id: string): AutonomousRecoveryPlan;
    approve(id: string, dto: ApproveRecoveryPlanDto): AutonomousRecoveryPlan;
    execute(id: string, dto: ExecuteRecoveryPlanDto): Promise<AutonomousRecoveryPlan>;
    rollback(id: string, actor: {
        id: string;
        type: "user" | "service" | "system" | "automation";
        name?: string;
        roles: string[];
    }): AutonomousRecoveryPlan;
    private executeAction;
}
