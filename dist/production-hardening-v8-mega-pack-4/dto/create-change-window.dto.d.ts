import { ChangeWindowType, GovernanceEnvironment, GovernanceRequestType, GovernanceRiskLevel } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateChangeWindowDto {
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    type: ChangeWindowType;
    startsAt: string;
    endsAt: string;
    timezone: string;
    allowedRequestTypes?: GovernanceRequestType[];
    blockedRequestTypes?: GovernanceRequestType[];
    maximumRiskLevel: GovernanceRiskLevel;
    requiresApproval?: boolean;
    requiredApprovalCount?: number;
    tags?: string[];
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
