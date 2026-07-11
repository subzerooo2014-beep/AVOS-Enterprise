import { CreateFeatureFlagDto } from "./dto/create-feature-flag.dto";
import { CreateRuntimeConfigurationDto } from "./dto/create-runtime-configuration.dto";
import { CreateRuntimeHealthRuleDto } from "./dto/create-runtime-health-rule.dto";
import { CreateRuntimePolicyDto } from "./dto/create-runtime-policy.dto";
import { DetectConfigurationDriftDto } from "./dto/detect-configuration-drift.dto";
import { EvaluateFeatureFlagDto } from "./dto/evaluate-feature-flag.dto";
import { EvaluateRuntimeHealthDto } from "./dto/evaluate-runtime-health.dto";
import { StartConfigurationRolloutDto } from "./dto/start-configuration-rollout.dto";
import { ProductionHardeningV7MegaPack14Service } from "./production-hardening-v7-mega-pack-14.service";
export declare class ProductionHardeningV7MegaPack14Controller {
    private readonly service;
    constructor(service: ProductionHardeningV7MegaPack14Service);
    status(): {
        generatedAt: string;
        healthStatus: "healthy" | "degraded" | "critical";
        evidenceChainVerified: boolean;
        configurations: number;
        activeConfigurations: number;
        rolledBackConfigurations: number;
        approvals: number;
        approvedApprovals: number;
        featureFlags: number;
        activeFeatureFlags: number;
        enabledFeatureFlags: number;
        featureEvaluations: number;
        rollouts: number;
        completedRollouts: number;
        failedRollouts: number;
        configurationDrifts: number;
        openDrifts: number;
        remediatedDrifts: number;
        runtimePolicies: number;
        activeRuntimePolicies: number;
        policyEvaluations: number;
        deniedPolicyEvaluations: number;
        healthRules: number;
        activeHealthRules: number;
        healthEvaluations: number;
        passedHealthEvaluations: number;
        failedHealthEvaluations: number;
        evidenceEntries: number;
        platformEvents: number;
        success: boolean;
        system: string;
        version: string;
    };
    snapshot(): {
        success: boolean;
        snapshot: import("./production-hardening-v7-mega-pack-14.types").RuntimeGovernanceSnapshot;
    };
    verify(): {
        success: boolean;
        system: string;
        version: string;
        healthStatus: "critical" | "healthy" | "degraded";
        evidenceChainVerified: boolean;
        checks: {
            runtimeConfigurationReady: boolean;
            approvalGovernanceReady: boolean;
            featureFlagGovernanceReady: boolean;
            safeRolloutReady: boolean;
            driftDetectionReady: boolean;
            runtimePolicyReady: boolean;
            runtimeHealthReady: boolean;
            noOpenDrifts: boolean;
            noFailedRollouts: boolean;
            noDeniedPolicyEvaluations: boolean;
            noFailedHealthEvaluations: boolean;
            evidenceChainVerified: boolean;
            platformEventsReady: boolean;
        };
        snapshot: import("./production-hardening-v7-mega-pack-14.types").RuntimeGovernanceSnapshot;
    };
    verifyEvidence(): {
        verified: boolean;
        entries: number;
        brokenAtSequence: number;
        checkedAt: string;
        success: boolean;
    } | {
        verified: boolean;
        entries: number;
        checkedAt: string;
        brokenAtSequence?: undefined;
        success: boolean;
    };
    evidence(): {
        success: boolean;
        entries: import("./production-hardening-v7-mega-pack-14.types").RuntimeEvidenceEntry[];
    };
    events(): {
        success: boolean;
        events: import("./production-hardening-v7-mega-pack-14.types").RuntimePlatformEvent[];
    };
    createConfiguration(dto: CreateRuntimeConfigurationDto): {
        success: boolean;
        configuration: import("./production-hardening-v7-mega-pack-14.types").RuntimeConfiguration;
    };
    listConfigurations(): {
        success: boolean;
        configurations: import("./production-hardening-v7-mega-pack-14.types").RuntimeConfiguration[];
    };
    getConfiguration(configurationId: string): {
        success: boolean;
        configuration: import("./production-hardening-v7-mega-pack-14.types").RuntimeConfiguration;
    };
    requestApproval(configurationId: string): {
        success: boolean;
        approval: import("./production-hardening-v7-mega-pack-14.types").RuntimeConfigurationApproval;
    };
    approveConfiguration(approvalId: string): {
        success: boolean;
        approval: import("./production-hardening-v7-mega-pack-14.types").RuntimeConfigurationApproval;
    };
    listApprovals(): {
        success: boolean;
        approvals: import("./production-hardening-v7-mega-pack-14.types").RuntimeConfigurationApproval[];
    };
    startRollout(configurationId: string, dto: StartConfigurationRolloutDto): {
        success: boolean;
        rollout: import("./production-hardening-v7-mega-pack-14.types").ConfigurationRollout;
    };
    rollbackConfiguration(configurationId: string): {
        success: boolean;
        configuration: import("./production-hardening-v7-mega-pack-14.types").RuntimeConfiguration;
    };
    listRollouts(): {
        success: boolean;
        rollouts: import("./production-hardening-v7-mega-pack-14.types").ConfigurationRollout[];
    };
    createFeatureFlag(dto: CreateFeatureFlagDto): {
        success: boolean;
        featureFlag: import("./production-hardening-v7-mega-pack-14.types").FeatureFlag;
    };
    listFeatureFlags(): {
        success: boolean;
        featureFlags: import("./production-hardening-v7-mega-pack-14.types").FeatureFlag[];
    };
    activateFeatureFlag(featureFlagId: string): {
        success: boolean;
        featureFlag: import("./production-hardening-v7-mega-pack-14.types").FeatureFlag;
    };
    evaluateFeatureFlag(featureFlagId: string, dto: EvaluateFeatureFlagDto): {
        success: boolean;
        evaluation: import("./production-hardening-v7-mega-pack-14.types").FeatureFlagEvaluation;
    };
    listFeatureEvaluations(): {
        success: boolean;
        evaluations: import("./production-hardening-v7-mega-pack-14.types").FeatureFlagEvaluation[];
    };
    detectConfigurationDrift(dto: DetectConfigurationDriftDto): {
        success: boolean;
        drift: import("./production-hardening-v7-mega-pack-14.types").ConfigurationDrift;
    };
    remediateConfigurationDrift(driftId: string): {
        success: boolean;
        drift: import("./production-hardening-v7-mega-pack-14.types").ConfigurationDrift;
    };
    listConfigurationDrifts(): {
        success: boolean;
        drifts: import("./production-hardening-v7-mega-pack-14.types").ConfigurationDrift[];
    };
    createRuntimePolicy(dto: CreateRuntimePolicyDto): {
        success: boolean;
        policy: import("./production-hardening-v7-mega-pack-14.types").RuntimePolicy;
    };
    listRuntimePolicies(): {
        success: boolean;
        policies: import("./production-hardening-v7-mega-pack-14.types").RuntimePolicy[];
    };
    evaluateRuntimePolicy(configurationId: string): {
        success: boolean;
        evaluation: import("./production-hardening-v7-mega-pack-14.types").RuntimePolicyEvaluation;
    };
    listPolicyEvaluations(): {
        success: boolean;
        evaluations: import("./production-hardening-v7-mega-pack-14.types").RuntimePolicyEvaluation[];
    };
    createHealthRule(dto: CreateRuntimeHealthRuleDto): {
        success: boolean;
        rule: import("./production-hardening-v7-mega-pack-14.types").RuntimeHealthRule;
    };
    listHealthRules(): {
        success: boolean;
        rules: import("./production-hardening-v7-mega-pack-14.types").RuntimeHealthRule[];
    };
    evaluateHealthRule(ruleId: string, dto: EvaluateRuntimeHealthDto): {
        success: boolean;
        evaluation: import("./production-hardening-v7-mega-pack-14.types").RuntimeHealthEvaluation;
    };
    listHealthEvaluations(): {
        success: boolean;
        evaluations: import("./production-hardening-v7-mega-pack-14.types").RuntimeHealthEvaluation[];
    };
}
