export type RuntimeConfigurationStatus = "draft" | "active" | "superseded" | "rolled_back" | "rejected";
export type RuntimeEnvironment = "development" | "testing" | "staging" | "production";
export type FeatureFlagStatus = "draft" | "active" | "disabled" | "retired";
export type RolloutStatus = "planned" | "running" | "completed" | "failed" | "rolled_back";
export type DriftSeverity = "low" | "medium" | "high" | "critical";
export type DriftStatus = "detected" | "acknowledged" | "remediated" | "ignored";
export type RuntimePolicyDecision = "allow" | "deny" | "require_approval" | "rollback" | "quarantine";
export interface RuntimeConfiguration {
    id: string;
    name: string;
    version: number;
    environment: RuntimeEnvironment;
    status: RuntimeConfigurationStatus;
    values: Record<string, unknown>;
    checksum: string;
    createdBy: string;
    approvedBy?: string;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
    rolledBackAt?: string;
    previousConfigurationId?: string;
}
export interface RuntimeConfigurationApproval {
    id: string;
    configurationId: string;
    requestedBy: string;
    reviewedBy?: string;
    status: "pending" | "approved" | "rejected";
    reason: string;
    requestedAt: string;
    reviewedAt?: string;
}
export interface FeatureFlag {
    id: string;
    key: string;
    name: string;
    description: string;
    environment: RuntimeEnvironment;
    status: FeatureFlagStatus;
    enabled: boolean;
    rolloutPercentage: number;
    allowedAudiences: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
}
export interface FeatureFlagEvaluation {
    id: string;
    featureFlagId: string;
    subjectReference: string;
    audience: string;
    enabled: boolean;
    reason: string;
    evaluatedAt: string;
}
export interface ConfigurationRollout {
    id: string;
    configurationId: string;
    environment: RuntimeEnvironment;
    status: RolloutStatus;
    strategy: "immediate" | "progressive" | "canary";
    targetPercentage: number;
    currentPercentage: number;
    healthThresholdPercent: number;
    startedAt: string;
    completedAt?: string;
    rolledBackAt?: string;
    requestedBy: string;
    failureReason?: string;
}
export interface ConfigurationDrift {
    id: string;
    configurationId: string;
    environment: RuntimeEnvironment;
    expectedChecksum: string;
    actualChecksum: string;
    severity: DriftSeverity;
    status: DriftStatus;
    detectedAt: string;
    acknowledgedAt?: string;
    remediatedAt?: string;
    description: string;
}
export interface RuntimePolicy {
    id: string;
    name: string;
    environment: RuntimeEnvironment;
    description: string;
    active: boolean;
    requiresApproval: boolean;
    blockedKeys: string[];
    protectedKeys: string[];
    minimumHealthPercent: number;
    createdAt: string;
}
export interface RuntimePolicyEvaluation {
    id: string;
    policyId: string;
    configurationId: string;
    decision: RuntimePolicyDecision;
    violations: string[];
    evaluatedAt: string;
}
export interface RuntimeHealthRule {
    id: string;
    name: string;
    environment: RuntimeEnvironment;
    metricName: string;
    operator: "gte" | "lte" | "gt" | "lt" | "eq";
    threshold: number;
    active: boolean;
    createdAt: string;
}
export interface RuntimeHealthEvaluation {
    id: string;
    ruleId: string;
    measuredValue: number;
    passed: boolean;
    evaluatedAt: string;
    message: string;
}
export interface RuntimeEvidenceEntry {
    id: string;
    sequence: number;
    eventType: string;
    entityType: string;
    entityId: string;
    actor: string;
    timestamp: string;
    payload: Record<string, unknown>;
    previousHash: string;
    hash: string;
}
export interface RuntimePlatformEvent {
    id: string;
    eventType: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    payload: Record<string, unknown>;
}
export interface RuntimeGovernanceSnapshot {
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
}
