import { GovernanceEnvironment, GovernanceRiskLevel, IsolationStrategy } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CreateIsolationRuleDto {
    nodeId: string;
    strategy: IsolationStrategy;
    trafficPercentage: number;
    blockIncomingTraffic: boolean;
    blockOutgoingTraffic: boolean;
    pauseBackgroundJobs: boolean;
    disableDependencies?: string[];
    preserveDependencies?: string[];
    reason: string;
    metadata?: Record<string, unknown>;
}
export declare class CreateIsolationPlanDto {
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    sourceNodeId: string;
    strategy: IsolationStrategy;
    riskLevel: GovernanceRiskLevel;
    rules: CreateIsolationRuleDto[];
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
