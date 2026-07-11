import { ActivateKillSwitchDto, ApproveConfigurationDto, CreateBaselineDto, CreateConfigurationDto, CreateFeatureFlagDto, CreateKillSwitchDto, CreatePolicyDto, ReleaseKillSwitchDto, RollbackConfigurationDto, UpdateFeatureFlagDto } from "./production-hardening-v7-mega-pack-8.dto";
import { ProductionHardeningV7MegaPack8Service } from "./production-hardening-v7-mega-pack-8.service";
export declare class ProductionHardeningV7MegaPack8Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack8Service);
    getStatus(): import("./production-hardening-v7-mega-pack-8.types").ConfigurationGovernanceStatus;
    getSnapshot(): {
        evidenceVerification: {
            verified: boolean;
            checked: number;
            brokenAt: string | null;
        };
        version: string;
        initializedAt: string;
        updatedAt: string;
        configurations: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEntry[];
        baselines: import("./production-hardening-v7-mega-pack-8.types").ConfigurationBaseline[];
        policies: import("./production-hardening-v7-mega-pack-8.types").ConfigurationPolicy[];
        evaluations: import("./production-hardening-v7-mega-pack-8.types").PolicyEvaluation[];
        featureFlags: import("./production-hardening-v7-mega-pack-8.types").FeatureFlag[];
        drifts: import("./production-hardening-v7-mega-pack-8.types").ConfigurationDrift[];
        approvals: import("./production-hardening-v7-mega-pack-8.types").ConfigurationApproval[];
        killSwitches: import("./production-hardening-v7-mega-pack-8.types").KillSwitch[];
        rollbacks: import("./production-hardening-v7-mega-pack-8.types").ConfigurationRollback[];
        evidence: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEvidence[];
        events: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEvent[];
    };
    verifyEvidence(): {
        verified: boolean;
        checked: number;
        brokenAt: string | null;
        success: boolean;
    };
    listConfigurations(): import("./production-hardening-v7-mega-pack-8.types").ConfigurationEntry[];
    createConfiguration(dto: CreateConfigurationDto): Promise<{
        configuration: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEntry;
        evaluation: import("./production-hardening-v7-mega-pack-8.types").PolicyEvaluation;
    }>;
    approveConfiguration(configurationId: string, dto: ApproveConfigurationDto): Promise<{
        configuration: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEntry;
        approval: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            configurationId: string;
            decision: "approved" | "rejected";
            approver: string;
            reason: string;
            createdAt: string;
        };
    }>;
    rollbackConfiguration(configurationId: string, dto: RollbackConfigurationDto): Promise<{
        rollback: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            configurationId: string;
            key: string;
            service: string;
            environment: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEnvironment;
            fromVersion: number;
            toVersion: number;
            reason: string;
            automatic: boolean;
            createdAt: string;
        };
        activeConfiguration: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEntry;
    }>;
    listPolicies(): import("./production-hardening-v7-mega-pack-8.types").ConfigurationPolicy[];
    createPolicy(dto: CreatePolicyDto): Promise<import("./production-hardening-v7-mega-pack-8.types").ConfigurationPolicy>;
    createBaseline(dto: CreateBaselineDto): Promise<import("./production-hardening-v7-mega-pack-8.types").ConfigurationBaseline>;
    scanDrift(baselineId: string): Promise<{
        readonly id: `${string}-${string}-${string}-${string}-${string}`;
        readonly baselineId: string;
        readonly service: string;
        readonly environment: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEnvironment;
        readonly status: "compliant" | "drifted" | "critical_drift";
        readonly missingKeys: string[];
        readonly unexpectedKeys: string[];
        readonly changedKeys: string[];
        readonly compliancePercentage: number;
        readonly detectedAt: string;
    }>;
    createFeatureFlag(dto: CreateFeatureFlagDto): Promise<import("./production-hardening-v7-mega-pack-8.types").FeatureFlag>;
    updateFeatureFlag(flagId: string, dto: UpdateFeatureFlagDto): Promise<import("./production-hardening-v7-mega-pack-8.types").FeatureFlag>;
    evaluateFeatureFlag(flagId: string, userId?: string, service?: string): Promise<{
        success: boolean;
        flagId: string;
        key: string;
        enabled: boolean;
        strategy: import("./production-hardening-v7-mega-pack-8.types").FeatureFlagStrategy;
        version: number;
    }>;
    createKillSwitch(dto: CreateKillSwitchDto): Promise<import("./production-hardening-v7-mega-pack-8.types").KillSwitch>;
    activateKillSwitch(switchId: string, dto: ActivateKillSwitchDto): Promise<import("./production-hardening-v7-mega-pack-8.types").KillSwitch>;
    releaseKillSwitch(switchId: string, dto: ReleaseKillSwitchDto): Promise<import("./production-hardening-v7-mega-pack-8.types").KillSwitch>;
}
