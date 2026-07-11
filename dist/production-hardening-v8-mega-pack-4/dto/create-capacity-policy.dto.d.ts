import { CapacityMetricType, GovernanceEnvironment } from "../contracts";
import { GovernanceActorDto } from "./governance-actor.dto";
export declare class CapacityPolicyThresholdDto {
    warning: number;
    critical: number;
    scaleOut: number;
    scaleIn?: number;
}
export declare class CreateCapacityPolicyDto {
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    service: string;
    metricType: CapacityMetricType;
    metricName: string;
    thresholds: CapacityPolicyThresholdDto;
    minimumInstances: number;
    maximumInstances: number;
    scaleStep: number;
    cooldownSeconds: number;
    allowAutomaticScaling: boolean;
    blockChangesWhenCritical: boolean;
    metadata?: Record<string, unknown>;
    actor: GovernanceActorDto;
}
