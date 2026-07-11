import { GovernanceEnvironment, GovernanceRequestType, GovernanceRiskLevel } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateGovernanceRequestDto {
    type: GovernanceRequestType;
    title: string;
    description: string;
    environment: GovernanceEnvironment;
    namespace: string;
    service?: string;
    requestedRiskLevel: GovernanceRiskLevel;
    changeWindowId?: string;
    maintenanceModeId?: string;
    rollbackPlanAvailable: boolean;
    testCoverage?: number;
    blastRadius?: number;
    businessCriticality?: number;
    approvalsRequired?: number;
    payload: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
