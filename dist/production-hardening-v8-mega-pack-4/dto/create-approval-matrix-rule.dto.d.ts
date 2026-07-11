import { GovernanceApprovalTier, GovernanceEnvironment, GovernanceRequestType, GovernanceRiskLevel } from "../contracts";
export declare class CreateApprovalMatrixRuleDto {
    name: string;
    environment?: GovernanceEnvironment;
    requestTypes: GovernanceRequestType[];
    minimumRiskLevel: GovernanceRiskLevel;
    maximumRiskLevel: GovernanceRiskLevel;
    minimumBlastRadius?: number;
    minimumBusinessCriticality?: number;
    rollbackPlanRequired: boolean;
    minimumTestCoverage?: number;
    tier: GovernanceApprovalTier;
    requiredApprovals: number;
    requiredRoles: string[];
    enabled: boolean;
    priority: number;
    metadata?: Record<string, unknown>;
}
