import { ConfigurationEnvironment, ConfigurationValue, FeatureFlagStrategy, PolicySeverity } from "./production-hardening-v7-mega-pack-8.types";
export declare class CreateConfigurationDto {
    key: string;
    service: string;
    environment: ConfigurationEnvironment;
    value: ConfigurationValue;
    sensitive?: boolean;
    description?: string;
    requestedBy: string;
}
export declare class ApproveConfigurationDto {
    decision: "approved" | "rejected";
    approver: string;
    reason: string;
}
export declare class CreateBaselineDto {
    name: string;
    service: string;
    environment: ConfigurationEnvironment;
    configuration: Record<string, ConfigurationValue>;
    createdBy: string;
}
export declare class CreatePolicyDto {
    code: string;
    name: string;
    description: string;
    service?: string;
    environment?: ConfigurationEnvironment;
    keyPattern: string;
    severity: PolicySeverity;
    required?: boolean;
    immutableInProduction?: boolean;
    allowedTypes?: string[];
    minimumNumber?: number;
    maximumNumber?: number;
    allowedValues?: ConfigurationValue[];
    blockedValues?: ConfigurationValue[];
}
export declare class CreateFeatureFlagDto {
    key: string;
    name: string;
    description?: string;
    service: string;
    environment: ConfigurationEnvironment;
    enabled?: boolean;
    strategy: FeatureFlagStrategy;
    rolloutPercentage?: number;
    targetServices?: string[];
    targetUsers?: string[];
    metadata?: Record<string, unknown>;
    createdBy: string;
}
export declare class UpdateFeatureFlagDto {
    enabled?: boolean;
    strategy?: FeatureFlagStrategy;
    rolloutPercentage?: number;
    targetServices?: string[];
    targetUsers?: string[];
    metadata?: Record<string, unknown>;
    updatedBy: string;
}
export declare class CreateKillSwitchDto {
    code: string;
    name: string;
    service: string;
    environment: ConfigurationEnvironment;
}
export declare class ActivateKillSwitchDto {
    reason: string;
    activatedBy: string;
}
export declare class ReleaseKillSwitchDto {
    releasedBy: string;
}
export declare class RollbackConfigurationDto {
    reason: string;
    automatic?: boolean;
}
