import { OnModuleInit } from "@nestjs/common";
import { ActivateKillSwitchDto, ApproveConfigurationDto, CreateBaselineDto, CreateConfigurationDto, CreateFeatureFlagDto, CreateKillSwitchDto, CreatePolicyDto, ReleaseKillSwitchDto, RollbackConfigurationDto, UpdateFeatureFlagDto } from "./production-hardening-v7-mega-pack-8.dto";
import { ProductionHardeningV7MegaPack8Store } from "./production-hardening-v7-mega-pack-8.store";
import { ConfigurationBaseline, ConfigurationEntry, ConfigurationGovernanceStatus, ConfigurationPolicy, FeatureFlag, KillSwitch, PolicyEvaluation } from "./production-hardening-v7-mega-pack-8.types";
export declare class ProductionHardeningV7MegaPack8Service implements OnModuleInit {
    private readonly store;
    constructor(store: ProductionHardeningV7MegaPack8Store);
    onModuleInit(): Promise<void>;
    getStatus(): ConfigurationGovernanceStatus;
    getSnapshot(): {
        evidenceVerification: {
            verified: boolean;
            checked: number;
            brokenAt: string | null;
        };
        version: string;
        initializedAt: string;
        updatedAt: string;
        configurations: ConfigurationEntry[];
        baselines: ConfigurationBaseline[];
        policies: ConfigurationPolicy[];
        evaluations: PolicyEvaluation[];
        featureFlags: FeatureFlag[];
        drifts: import("./production-hardening-v7-mega-pack-8.types").ConfigurationDrift[];
        approvals: import("./production-hardening-v7-mega-pack-8.types").ConfigurationApproval[];
        killSwitches: KillSwitch[];
        rollbacks: import("./production-hardening-v7-mega-pack-8.types").ConfigurationRollback[];
        evidence: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEvidence[];
        events: import("./production-hardening-v7-mega-pack-8.types").ConfigurationEvent[];
    };
    listConfigurations(): ConfigurationEntry[];
    createConfiguration(dto: CreateConfigurationDto): Promise<{
        configuration: ConfigurationEntry;
        evaluation: PolicyEvaluation;
    }>;
    approveConfiguration(configurationId: string, dto: ApproveConfigurationDto): Promise<{
        configuration: ConfigurationEntry;
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
        activeConfiguration: ConfigurationEntry;
    }>;
    listPolicies(): ConfigurationPolicy[];
    createPolicy(dto: CreatePolicyDto): Promise<ConfigurationPolicy>;
    createBaseline(dto: CreateBaselineDto): Promise<ConfigurationBaseline>;
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
    createFeatureFlag(dto: CreateFeatureFlagDto): Promise<FeatureFlag>;
    updateFeatureFlag(flagId: string, dto: UpdateFeatureFlagDto): Promise<FeatureFlag>;
    evaluateFeatureFlag(flagId: string, context: {
        userId?: string;
        service?: string;
    }): Promise<{
        success: boolean;
        flagId: string;
        key: string;
        enabled: boolean;
        strategy: import("./production-hardening-v7-mega-pack-8.types").FeatureFlagStrategy;
        version: number;
    }>;
    createKillSwitch(dto: CreateKillSwitchDto): Promise<KillSwitch>;
    activateKillSwitch(switchId: string, dto: ActivateKillSwitchDto): Promise<KillSwitch>;
    releaseKillSwitch(switchId: string, dto: ReleaseKillSwitchDto): Promise<KillSwitch>;
    verifyEvidenceChain(): {
        verified: boolean;
        checked: number;
        brokenAt: string | null;
        success: boolean;
    };
    private evaluateConfigurationRules;
    private bootstrapDefaults;
    private recordActivity;
    private uniqueStrings;
    private hash;
    private stableStringify;
}
