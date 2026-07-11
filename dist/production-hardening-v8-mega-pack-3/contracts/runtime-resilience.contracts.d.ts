import { ApprovalDecision, EvidenceEntryType, ResilienceActionStatus, ResilienceActionType, ResilienceConfigurationStatus, ResiliencePolicyStatus, RuntimeChangeType, RuntimeControlMode, RuntimeDecision, RuntimeEnvironment, RuntimeIncidentSeverity, RuntimeIncidentStatus, RuntimeRiskLevel, RuntimeSignalStatus, RuntimeSignalType } from "./runtime-resilience.enums";
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | {
    [key: string]: JsonValue;
};
export interface RuntimeActor {
    id: string;
    type: "user" | "service" | "system" | "automation";
    name?: string;
    roles?: string[];
    ipAddress?: string;
    userAgent?: string;
}
export interface RuntimeApprovalRecord {
    id: string;
    configurationId: string;
    decision: ApprovalDecision;
    actor: RuntimeActor;
    reason: string;
    decidedAt: string;
}
export interface RuntimeRollbackTarget {
    configurationId: string;
    configurationVersion: number;
    baselineId?: string;
    reason: string;
}
export interface ResilienceConfiguration {
    id: string;
    key: string;
    name: string;
    description?: string;
    environment: RuntimeEnvironment;
    namespace: string;
    version: number;
    status: ResilienceConfigurationStatus;
    controlMode: RuntimeControlMode;
    changeType: RuntimeChangeType;
    payload: Record<string, JsonValue>;
    payloadHash: string;
    tags: string[];
    requiresApproval: boolean;
    minimumApprovals: number;
    approvals: RuntimeApprovalRecord[];
    rejectionReason?: string;
    rollbackTarget?: RuntimeRollbackTarget;
    previousConfigurationId?: string;
    createdBy: RuntimeActor;
    createdAt: string;
    updatedAt: string;
    submittedAt?: string;
    activatedAt?: string;
    rejectedAt?: string;
    rolledBackAt?: string;
    archivedAt?: string;
}
export interface ResiliencePolicyCondition {
    field: string;
    operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
    value?: JsonValue;
}
export interface ResiliencePolicyRule {
    id: string;
    name: string;
    description?: string;
    priority: number;
    enabled: boolean;
    conditions: ResiliencePolicyCondition[];
    decision: RuntimeDecision;
    riskLevel: RuntimeRiskLevel;
    requiredApprovals?: number;
    actionTypes?: ResilienceActionType[];
    metadata?: Record<string, JsonValue>;
}
export interface ResiliencePolicy {
    id: string;
    key: string;
    name: string;
    description?: string;
    version: number;
    status: ResiliencePolicyStatus;
    environment?: RuntimeEnvironment;
    namespace?: string;
    rules: ResiliencePolicyRule[];
    defaultDecision: RuntimeDecision;
    defaultRiskLevel: RuntimeRiskLevel;
    createdBy: RuntimeActor;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
    disabledAt?: string;
    archivedAt?: string;
}
export interface RuntimeRiskFactor {
    key: string;
    label: string;
    score: number;
    weight: number;
    weightedScore: number;
    reason: string;
    metadata?: Record<string, JsonValue>;
}
export interface RuntimeRiskEvaluation {
    id: string;
    configurationId?: string;
    policyId?: string;
    environment: RuntimeEnvironment;
    namespace: string;
    changeType: RuntimeChangeType;
    riskScore: number;
    riskLevel: RuntimeRiskLevel;
    decision: RuntimeDecision;
    factors: RuntimeRiskFactor[];
    matchedRuleIds: string[];
    requiredApprovals: number;
    reasons: string[];
    evaluatedBy: RuntimeActor;
    evaluatedAt: string;
    context: Record<string, JsonValue>;
}
export interface RuntimeSignal {
    id: string;
    source: string;
    environment: RuntimeEnvironment;
    namespace: string;
    service: string;
    type: RuntimeSignalType;
    status: RuntimeSignalStatus;
    value: number;
    unit?: string;
    thresholdWarning?: number;
    thresholdCritical?: number;
    message?: string;
    labels: Record<string, string>;
    metadata: Record<string, JsonValue>;
    observedAt: string;
    receivedAt: string;
}
export interface RuntimeIncidentTimelineEntry {
    id: string;
    status: RuntimeIncidentStatus;
    message: string;
    actor: RuntimeActor;
    createdAt: string;
    metadata?: Record<string, JsonValue>;
}
export interface RuntimeIncident {
    id: string;
    incidentNumber: string;
    title: string;
    description: string;
    environment: RuntimeEnvironment;
    namespace: string;
    service?: string;
    severity: RuntimeIncidentSeverity;
    status: RuntimeIncidentStatus;
    riskLevel: RuntimeRiskLevel;
    signalIds: string[];
    configurationIds: string[];
    actionIds: string[];
    owner?: RuntimeActor;
    tags: string[];
    timeline: RuntimeIncidentTimelineEntry[];
    detectedAt: string;
    acknowledgedAt?: string;
    resolvedAt?: string;
    closedAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ResilienceActionExecution {
    id: string;
    actionId: string;
    attempt: number;
    startedAt: string;
    completedAt?: string;
    succeeded: boolean;
    output?: Record<string, JsonValue>;
    error?: string;
    evidenceEntryId?: string;
}
export interface ResilienceAction {
    id: string;
    incidentId?: string;
    configurationId?: string;
    type: ResilienceActionType;
    status: ResilienceActionStatus;
    name: string;
    description?: string;
    target: string;
    parameters: Record<string, JsonValue>;
    requiresApproval: boolean;
    approvedBy?: RuntimeActor;
    approvedAt?: string;
    requestedBy: RuntimeActor;
    requestedAt: string;
    scheduledAt?: string;
    startedAt?: string;
    completedAt?: string;
    executions: ResilienceActionExecution[];
    idempotencyKey: string;
    dryRun: boolean;
    error?: string;
}
export interface RuntimeBaseline {
    id: string;
    key: string;
    name: string;
    environment: RuntimeEnvironment;
    namespace: string;
    configurationIds: string[];
    signalSnapshot: Record<string, JsonValue>;
    metadata: Record<string, JsonValue>;
    snapshotHash: string;
    capturedBy: RuntimeActor;
    capturedAt: string;
    active: boolean;
}
export interface EvidenceEntry {
    id: string;
    sequence: number;
    type: EvidenceEntryType;
    aggregateType: string;
    aggregateId: string;
    actor: RuntimeActor;
    payload: Record<string, JsonValue>;
    metadata: Record<string, JsonValue>;
    previousHash: string;
    payloadHash: string;
    entryHash: string;
    createdAt: string;
}
export interface EvidenceIntegrityResult {
    valid: boolean;
    checkedEntries: number;
    firstSequence?: number;
    lastSequence?: number;
    brokenSequence?: number;
    expectedHash?: string;
    actualHash?: string;
    verifiedAt: string;
}
export interface RuntimeResilienceSnapshot {
    generatedAt: string;
    system: string;
    version: string;
    healthStatus: "healthy" | "degraded" | "unhealthy";
    evidenceChainVerified: boolean;
    controlMode: RuntimeControlMode;
    configurations: number;
    activeConfigurations: number;
    pendingApprovals: number;
    policies: number;
    activePolicies: number;
    riskEvaluations: number;
    blockedEvaluations: number;
    signals: number;
    unhealthySignals: number;
    incidents: number;
    openIncidents: number;
    actions: number;
    runningActions: number;
    failedActions: number;
    baselines: number;
    activeBaselines: number;
    evidenceEntries: number;
}
