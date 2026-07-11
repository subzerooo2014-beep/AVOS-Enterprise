import { GovernanceSimulationStatus, GovernanceImpactCategory, GovernanceApprovalTier, RecoveryPlanStatus, RecoveryActionType, RecoveryActionStatus, IsolationStrategy, IsolationPlanStatus, CapacityMetricType, CapacityPolicyStatus, CapacityDecision, CapacityEvaluationStatus, RuntimeDecisionRecordStatus, RuntimeDecisionSource, RuntimeDecisionConfidence, ApprovalSuggestionDecision, GuardrailType, GuardrailStatus, GuardrailEvaluationResult, RuntimeRunbookStatus, RuntimeRunbookStepType, RuntimeRunbookExecutionStatus, RuntimeRunbookStepStatus, RuntimeChangeExecutionStatus, RuntimeLockType, RuntimeLockStatus, RuntimeExecutionEvidenceType, GovernanceScheduleStatus, GovernanceScheduleType, GovernanceScheduleRunStatus, GovernanceEscalationStatus, GovernanceEscalationSeverity, GovernanceEscalationReason, GovernanceNotificationChannel, GovernanceNotificationStatus, GovernanceTimelineEventType, GovernanceCheckpointStatus, GovernanceCheckpointType, GovernanceSnapshotScope, GovernanceRetentionStatus, GovernanceRetentionAction, GovernanceArchiveStatus, GovernanceArchiveType, GovernanceRestoreStatus, GovernanceDataClassification } from "./runtime-governance.enums";
import { CascadingFailureRisk, ChangeWindowStatus, ChangeWindowType, DependencyHealthStatus, DependencyNodeType, DependencyRelationshipType, GovernanceApprovalStatus, GovernanceAuditEventType, GovernanceControlMode, GovernanceDecision, GovernanceEnvironment, GovernanceRecommendationType, GovernanceRequestStatus, GovernanceRequestType, GovernanceRiskLevel, MaintenanceModeStatus, SloComplianceStatus } from "./runtime-governance.enums";
export type GovernanceJsonPrimitive = string | number | boolean | null;
export type GovernanceJsonValue = GovernanceJsonPrimitive | GovernanceJsonValue[] | {
    [key: string]: GovernanceJsonValue;
};
export interface GovernanceActor {
    id: string;
    type: "user" | "service" | "system" | "automation";
    name?: string;
    roles: string[];
    ipAddress?: string;
    userAgent?: string;
}
export interface GovernanceChangeWindow {
    id: string;
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    type: ChangeWindowType;
    status: ChangeWindowStatus;
    startsAt: string;
    endsAt: string;
    timezone: string;
    allowedRequestTypes: GovernanceRequestType[];
    blockedRequestTypes: GovernanceRequestType[];
    maximumRiskLevel: GovernanceRiskLevel;
    requiresApproval: boolean;
    requiredApprovalCount: number;
    tags: string[];
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    openedAt?: string;
    closedAt?: string;
    cancelledAt?: string;
}
export interface GovernanceMaintenanceMode {
    id: string;
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    status: MaintenanceModeStatus;
    startsAt: string;
    endsAt?: string;
    affectedServices: string[];
    allowReadOperations: boolean;
    allowWriteOperations: boolean;
    allowBackgroundJobs: boolean;
    allowDeployments: boolean;
    publicMessage?: string;
    internalMessage?: string;
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
}
export interface GovernanceApproval {
    id: string;
    requestId: string;
    status: GovernanceApprovalStatus;
    actor: GovernanceActor;
    reason: string;
    createdAt: string;
    expiresAt?: string;
}
export interface GovernanceEvaluationFactor {
    key: string;
    label: string;
    score: number;
    weight: number;
    weightedScore: number;
    reason: string;
    metadata: Record<string, GovernanceJsonValue>;
}
export interface GovernanceRecommendation {
    id: string;
    requestId: string;
    type: GovernanceRecommendationType;
    priority: number;
    title: string;
    description: string;
    required: boolean;
    confidence: number;
    metadata: Record<string, GovernanceJsonValue>;
    createdAt: string;
}
export interface GovernanceRequest {
    id: string;
    requestNumber: string;
    type: GovernanceRequestType;
    status: GovernanceRequestStatus;
    title: string;
    description: string;
    environment: GovernanceEnvironment;
    namespace: string;
    service?: string;
    requestedRiskLevel: GovernanceRiskLevel;
    evaluatedRiskLevel?: GovernanceRiskLevel;
    riskScore?: number;
    decision?: GovernanceDecision;
    changeWindowId?: string;
    maintenanceModeId?: string;
    rollbackPlanAvailable: boolean;
    testCoverage?: number;
    blastRadius?: number;
    businessCriticality?: number;
    approvalsRequired: number;
    approvals: GovernanceApproval[];
    evaluationFactors: GovernanceEvaluationFactor[];
    recommendations: GovernanceRecommendation[];
    payload: Record<string, GovernanceJsonValue>;
    metadata: Record<string, GovernanceJsonValue>;
    requestedBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    evaluatedAt?: string;
    approvedAt?: string;
    rejectedAt?: string;
    executedAt?: string;
    failedAt?: string;
}
export interface RuntimeDependencyNode {
    id: string;
    key: string;
    name: string;
    type: DependencyNodeType;
    environment: GovernanceEnvironment;
    namespace: string;
    service?: string;
    criticality: number;
    healthStatus: DependencyHealthStatus;
    healthScore: number;
    region?: string;
    zone?: string;
    owner?: string;
    tags: string[];
    metadata: Record<string, GovernanceJsonValue>;
    createdAt: string;
    updatedAt: string;
    lastHealthCheckAt?: string;
}
export interface RuntimeDependencyEdge {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    relationshipType: DependencyRelationshipType;
    criticality: number;
    timeoutMilliseconds?: number;
    retryEnabled: boolean;
    fallbackNodeId?: string;
    metadata: Record<string, GovernanceJsonValue>;
    createdAt: string;
    updatedAt: string;
}
export interface CascadingFailurePath {
    nodeIds: string[];
    edgeIds: string[];
    cumulativeCriticality: number;
    affectedServices: string[];
    risk: CascadingFailureRisk;
}
export interface CascadingFailureAnalysis {
    id: string;
    sourceNodeId: string;
    risk: CascadingFailureRisk;
    riskScore: number;
    directDependents: number;
    totalAffectedNodes: number;
    affectedServiceCount: number;
    paths: CascadingFailurePath[];
    recommendations: string[];
    analyzedAt: string;
}
export interface RuntimeSloDefinition {
    id: string;
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    service: string;
    metric: string;
    target: number;
    warningThreshold: number;
    breachThreshold: number;
    evaluationWindowMinutes: number;
    enabled: boolean;
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
}
export interface RuntimeSloEvaluation {
    id: string;
    sloId: string;
    actualValue: number;
    targetValue: number;
    complianceStatus: SloComplianceStatus;
    errorBudgetRemaining: number;
    breachPercentage: number;
    observedAt: string;
    evaluatedAt: string;
    metadata: Record<string, GovernanceJsonValue>;
}
export interface GovernanceAuditEntry {
    id: string;
    sequence: number;
    type: GovernanceAuditEventType;
    aggregateType: string;
    aggregateId: string;
    actor: GovernanceActor;
    payload: Record<string, GovernanceJsonValue>;
    metadata: Record<string, GovernanceJsonValue>;
    previousHash: string;
    payloadHash: string;
    entryHash: string;
    createdAt: string;
}
export interface GovernanceIntegrityResult {
    valid: boolean;
    checkedEntries: number;
    firstSequence?: number;
    lastSequence?: number;
    brokenSequence?: number;
    expectedHash?: string;
    actualHash?: string;
    verifiedAt: string;
}
export interface RuntimeGovernanceSnapshot {
    success: boolean;
    system: string;
    version: string;
    healthStatus: "healthy" | "degraded" | "unhealthy";
    controlMode: GovernanceControlMode;
    evidenceChainVerified: boolean;
    changeWindows: number;
    openChangeWindows: number;
    maintenanceModes: number;
    activeMaintenanceModes: number;
    governanceRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    dependencyNodes: number;
    dependencyEdges: number;
    unhealthyDependencies: number;
    cascadeAnalyses: number;
    criticalCascadeAnalyses: number;
    sloDefinitions: number;
    activeSloDefinitions: number;
    sloEvaluations: number;
    breachedSlos: number;
    recommendations: number;
    auditEntries: number;
    generatedAt: string;
}
export interface GovernanceSimulationScenario {
    id: string;
    name: string;
    description?: string;
    changes: Record<string, GovernanceJsonValue>;
    assumptions: Record<string, GovernanceJsonValue>;
}
export interface GovernanceSimulationFinding {
    id: string;
    category: GovernanceImpactCategory;
    severity: GovernanceRiskLevel;
    title: string;
    description: string;
    affectedResourceIds: string[];
    confidence: number;
    metadata: Record<string, GovernanceJsonValue>;
}
export interface GovernancePolicySimulation {
    id: string;
    requestId: string;
    status: GovernanceSimulationStatus;
    scenario: GovernanceSimulationScenario;
    predictedDecision: GovernanceDecision;
    predictedRiskLevel: GovernanceRiskLevel;
    predictedRiskScore: number;
    findings: GovernanceSimulationFinding[];
    recommendations: string[];
    startedAt: string;
    completedAt?: string;
    failedAt?: string;
    error?: string;
}
export interface GovernanceImpactItem {
    id: string;
    category: GovernanceImpactCategory;
    resourceId: string;
    resourceName: string;
    direct: boolean;
    impactScore: number;
    riskLevel: GovernanceRiskLevel;
    reason: string;
    metadata: Record<string, GovernanceJsonValue>;
}
export interface GovernanceImpactAnalysis {
    id: string;
    requestId: string;
    overallImpactScore: number;
    overallRiskLevel: GovernanceRiskLevel;
    directlyAffectedResources: number;
    indirectlyAffectedResources: number;
    affectedServices: string[];
    affectedDependencies: string[];
    items: GovernanceImpactItem[];
    recommendations: string[];
    analyzedAt: string;
}
export interface GovernanceApprovalMatrixRule {
    id: string;
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
    metadata: Record<string, GovernanceJsonValue>;
}
export interface GovernanceApprovalMatrixDecision {
    requestId: string;
    tier: GovernanceApprovalTier;
    requiredApprovals: number;
    requiredRoles: string[];
    matchedRuleIds: string[];
    reasons: string[];
    evaluatedAt: string;
}
export interface GovernanceDashboardSnapshot {
    system: string;
    version: string;
    healthStatus: "healthy" | "degraded" | "unhealthy";
    controlMode: GovernanceControlMode;
    evidenceChainVerified: boolean;
    requests: {
        total: number;
        pending: number;
        evaluating: number;
        approved: number;
        rejected: number;
        deferred: number;
        executed: number;
        failed: number;
    };
    changeWindows: {
        total: number;
        open: number;
        scheduled: number;
        freeze: number;
        emergency: number;
    };
    maintenance: {
        total: number;
        active: number;
        scheduled: number;
    };
    dependencies: {
        nodes: number;
        edges: number;
        healthy: number;
        degraded: number;
        unhealthy: number;
        unavailable: number;
        unknown: number;
    };
    slo: {
        definitions: number;
        enabledDefinitions: number;
        evaluations: number;
        compliant: number;
        atRisk: number;
        breached: number;
        unknown: number;
    };
    cascade: {
        analyses: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        none: number;
    };
    simulations: {
        total: number;
        completed: number;
        failed: number;
    };
    impactAnalyses: number;
    approvalMatrixRules: number;
    recommendations: number;
    auditEntries: number;
    generatedAt: string;
}
export interface RecoveryActionExecution {
    id: string;
    actionId: string;
    attempt: number;
    status: RecoveryActionStatus;
    startedAt: string;
    completedAt?: string;
    output: Record<string, GovernanceJsonValue>;
    error?: string;
}
export interface RecoveryAction {
    id: string;
    planId: string;
    type: RecoveryActionType;
    status: RecoveryActionStatus;
    name: string;
    description?: string;
    target: string;
    order: number;
    required: boolean;
    timeoutSeconds: number;
    retryLimit: number;
    parameters: Record<string, GovernanceJsonValue>;
    rollbackActionType?: RecoveryActionType;
    rollbackParameters?: Record<string, GovernanceJsonValue>;
    executions: RecoveryActionExecution[];
}
export interface AutonomousRecoveryPlan {
    id: string;
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    service?: string;
    sourceNodeId?: string;
    cascadeAnalysisId?: string;
    governanceRequestId?: string;
    status: RecoveryPlanStatus;
    riskLevel: GovernanceRiskLevel;
    requiresApproval: boolean;
    approvalsRequired: number;
    approvedBy: GovernanceActor[];
    actions: RecoveryAction[];
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
    cancelledAt?: string;
    rolledBackAt?: string;
    error?: string;
}
export interface ServiceIsolationRule {
    id: string;
    nodeId: string;
    strategy: IsolationStrategy;
    trafficPercentage: number;
    blockIncomingTraffic: boolean;
    blockOutgoingTraffic: boolean;
    pauseBackgroundJobs: boolean;
    disableDependencies: string[];
    preserveDependencies: string[];
    reason: string;
    metadata: Record<string, GovernanceJsonValue>;
}
export interface ServiceIsolationPlan {
    id: string;
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    sourceNodeId: string;
    status: IsolationPlanStatus;
    strategy: IsolationStrategy;
    riskLevel: GovernanceRiskLevel;
    affectedNodeIds: string[];
    affectedServices: string[];
    rules: ServiceIsolationRule[];
    recommendations: string[];
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    failedAt?: string;
    error?: string;
}
export interface CapacityPolicyThreshold {
    warning: number;
    critical: number;
    scaleOut: number;
    scaleIn?: number;
}
export interface RuntimeCapacityPolicy {
    id: string;
    key: string;
    name: string;
    description?: string;
    environment: GovernanceEnvironment;
    namespace: string;
    service: string;
    metricType: CapacityMetricType;
    metricName: string;
    status: CapacityPolicyStatus;
    thresholds: CapacityPolicyThreshold;
    minimumInstances: number;
    maximumInstances: number;
    scaleStep: number;
    cooldownSeconds: number;
    allowAutomaticScaling: boolean;
    blockChangesWhenCritical: boolean;
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
    disabledAt?: string;
    lastEvaluationAt?: string;
    lastActionAt?: string;
}
export interface RuntimeCapacityEvaluation {
    id: string;
    policyId: string;
    service: string;
    metricType: CapacityMetricType;
    metricName: string;
    actualValue: number;
    currentInstances: number;
    status: CapacityEvaluationStatus;
    decision: CapacityDecision;
    recommendedInstances: number;
    reason: string;
    metadata: Record<string, GovernanceJsonValue>;
    observedAt: string;
    evaluatedAt: string;
}
export interface RuntimeDecisionEvidence {
    id: string;
    source: RuntimeDecisionSource;
    sourceId?: string;
    label: string;
    value: GovernanceJsonValue;
    weight: number;
    score: number;
    reason: string;
    metadata: Record<string, GovernanceJsonValue>;
}
export interface RuntimeDecisionRecord {
    id: string;
    requestId: string;
    status: RuntimeDecisionRecordStatus;
    decision: GovernanceDecision;
    source: RuntimeDecisionSource;
    confidence: RuntimeDecisionConfidence;
    confidenceScore: number;
    riskLevel: GovernanceRiskLevel;
    riskScore: number;
    approvalTier: GovernanceApprovalTier;
    approvalsRequired: number;
    requiredRoles: string[];
    evidence: RuntimeDecisionEvidence[];
    reasons: string[];
    recommendations: string[];
    expiresAt?: string;
    createdBy: GovernanceActor;
    reviewedBy?: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    reviewedAt?: string;
    acceptedAt?: string;
    rejectedAt?: string;
    overriddenAt?: string;
    executedAt?: string;
    overrideReason?: string;
}
export interface AutonomousApprovalSuggestion {
    id: string;
    requestId: string;
    decision: ApprovalSuggestionDecision;
    confidence: RuntimeDecisionConfidence;
    confidenceScore: number;
    suggestedApprovalCount: number;
    suggestedRoles: string[];
    reasons: string[];
    blockingConditions: string[];
    warningConditions: string[];
    metadata: Record<string, GovernanceJsonValue>;
    generatedAt: string;
}
export interface RuntimeGuardrailCondition {
    field: string;
    operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "exists" | "contains";
    value?: GovernanceJsonValue;
}
export interface RuntimeGuardrail {
    id: string;
    key: string;
    name: string;
    description?: string;
    type: GuardrailType;
    status: GuardrailStatus;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    requestTypes: GovernanceRequestType[];
    conditions: RuntimeGuardrailCondition[];
    failureDecision: GovernanceDecision;
    warningOnly: boolean;
    priority: number;
    requiredRoles: string[];
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
    disabledAt?: string;
    archivedAt?: string;
}
export interface RuntimeGuardrailEvaluation {
    id: string;
    guardrailId: string;
    requestId: string;
    result: GuardrailEvaluationResult;
    decision?: GovernanceDecision;
    reasons: string[];
    evaluatedValues: Record<string, GovernanceJsonValue>;
    evaluatedAt: string;
}
export interface RuntimeDecisionCenterSnapshot {
    totalDecisions: number;
    generatedDecisions: number;
    pendingReview: number;
    acceptedDecisions: number;
    rejectedDecisions: number;
    overriddenDecisions: number;
    executedDecisions: number;
    approvalSuggestions: number;
    activeGuardrails: number;
    guardrailEvaluations: number;
    failedGuardrails: number;
    warningGuardrails: number;
    generatedAt: string;
}
export interface RuntimeRunbookStepDefinition {
    id: string;
    name: string;
    description?: string;
    type: RuntimeRunbookStepType;
    order: number;
    required: boolean;
    timeoutSeconds: number;
    retryLimit: number;
    continueOnFailure: boolean;
    condition?: Record<string, GovernanceJsonValue>;
    parameters: Record<string, GovernanceJsonValue>;
    rollbackStepType?: RuntimeRunbookStepType;
    rollbackParameters?: Record<string, GovernanceJsonValue>;
}
export interface RuntimeRunbookDefinition {
    id: string;
    key: string;
    name: string;
    description?: string;
    version: number;
    status: RuntimeRunbookStatus;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    requestTypes: GovernanceRequestType[];
    minimumRiskLevel: GovernanceRiskLevel;
    maximumRiskLevel: GovernanceRiskLevel;
    requiresApproval: boolean;
    requiredRoles: string[];
    steps: RuntimeRunbookStepDefinition[];
    tags: string[];
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
    disabledAt?: string;
    archivedAt?: string;
}
export interface RuntimeRunbookStepExecution {
    id: string;
    runbookExecutionId: string;
    stepDefinitionId: string;
    status: RuntimeRunbookStepStatus;
    attempt: number;
    startedAt: string;
    completedAt?: string;
    output: Record<string, GovernanceJsonValue>;
    error?: string;
}
export interface RuntimeRunbookExecution {
    id: string;
    runbookId: string;
    runbookVersion: number;
    governanceRequestId?: string;
    decisionRecordId?: string;
    changeExecutionId?: string;
    status: RuntimeRunbookExecutionStatus;
    currentStepOrder?: number;
    stepExecutions: RuntimeRunbookStepExecution[];
    runtimeContext: Record<string, GovernanceJsonValue>;
    dryRun: boolean;
    startedBy: GovernanceActor;
    startedAt: string;
    updatedAt: string;
    completedAt?: string;
    failedAt?: string;
    cancelledAt?: string;
    rolledBackAt?: string;
    error?: string;
}
export interface RuntimeChangeExecution {
    id: string;
    executionNumber: string;
    governanceRequestId: string;
    decisionRecordId?: string;
    runbookExecutionId?: string;
    recoveryPlanId?: string;
    isolationPlanId?: string;
    status: RuntimeChangeExecutionStatus;
    environment: GovernanceEnvironment;
    namespace: string;
    service?: string;
    requestType: GovernanceRequestType;
    riskLevel: GovernanceRiskLevel;
    dryRun: boolean;
    validations: RuntimeChangeValidation[];
    lockIds: string[];
    evidenceIds: string[];
    metadata: Record<string, GovernanceJsonValue>;
    requestedBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
    rolledBackAt?: string;
    cancelledAt?: string;
    error?: string;
}
export interface RuntimeChangeValidation {
    id: string;
    key: string;
    name: string;
    success: boolean;
    blocking: boolean;
    expected: GovernanceJsonValue;
    actual: GovernanceJsonValue;
    reason: string;
    checkedAt: string;
}
export interface RuntimeExecutionLock {
    id: string;
    key: string;
    type: RuntimeLockType;
    status: RuntimeLockStatus;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    resourceId?: string;
    changeExecutionId?: string;
    owner: GovernanceActor;
    acquiredAt: string;
    expiresAt: string;
    releasedAt?: string;
    releaseReason?: string;
    metadata: Record<string, GovernanceJsonValue>;
}
export interface RuntimeExecutionEvidence {
    id: string;
    sequence: number;
    changeExecutionId: string;
    runbookExecutionId?: string;
    stepExecutionId?: string;
    type: RuntimeExecutionEvidenceType;
    actor: GovernanceActor;
    payload: Record<string, GovernanceJsonValue>;
    previousHash: string;
    payloadHash: string;
    entryHash: string;
    createdAt: string;
}
export interface RuntimeExecutionSnapshot {
    runbooks: number;
    activeRunbooks: number;
    runbookExecutions: number;
    runningRunbookExecutions: number;
    failedRunbookExecutions: number;
    changeExecutions: number;
    activeChangeExecutions: number;
    blockedChangeExecutions: number;
    failedChangeExecutions: number;
    activeLocks: number;
    expiredLocks: number;
    executionEvidenceEntries: number;
    evidenceChainVerified: boolean;
    generatedAt: string;
}
export interface GovernanceSchedule {
    id: string;
    key: string;
    name: string;
    description?: string;
    type: GovernanceScheduleType;
    status: GovernanceScheduleStatus;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    targetId?: string;
    runAt?: string;
    intervalSeconds?: number;
    maximumRuns?: number;
    runCount: number;
    retryLimit: number;
    retryDelaySeconds: number;
    enabled: boolean;
    payload: Record<string, GovernanceJsonValue>;
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
    pausedAt?: string;
    completedAt?: string;
    failedAt?: string;
    cancelledAt?: string;
    expiresAt?: string;
    lastRunAt?: string;
    nextRunAt?: string;
    lastError?: string;
}
export interface GovernanceScheduleRun {
    id: string;
    scheduleId: string;
    runNumber: number;
    status: GovernanceScheduleRunStatus;
    startedAt: string;
    completedAt?: string;
    output: Record<string, GovernanceJsonValue>;
    error?: string;
}
export interface GovernanceEscalation {
    id: string;
    escalationNumber: string;
    status: GovernanceEscalationStatus;
    severity: GovernanceEscalationSeverity;
    reason: GovernanceEscalationReason;
    title: string;
    description: string;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    governanceRequestId?: string;
    decisionRecordId?: string;
    changeExecutionId?: string;
    runbookExecutionId?: string;
    recoveryPlanId?: string;
    isolationPlanId?: string;
    dependencyNodeId?: string;
    sloEvaluationId?: string;
    capacityEvaluationId?: string;
    assignedRoles: string[];
    assignedActors: GovernanceActor[];
    acknowledgementRequired: boolean;
    acknowledgedBy?: GovernanceActor;
    resolution?: string;
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    acknowledgedAt?: string;
    resolvedAt?: string;
    cancelledAt?: string;
    expiresAt?: string;
}
export interface GovernanceNotificationRecipient {
    id?: string;
    name?: string;
    address: string;
    channel: GovernanceNotificationChannel;
    roles: string[];
}
export interface GovernanceNotification {
    id: string;
    notificationNumber: string;
    status: GovernanceNotificationStatus;
    channel: GovernanceNotificationChannel;
    subject: string;
    message: string;
    recipients: GovernanceNotificationRecipient[];
    escalationId?: string;
    governanceRequestId?: string;
    decisionRecordId?: string;
    changeExecutionId?: string;
    scheduleRunId?: string;
    priority: number;
    deduplicationKey?: string;
    payload: Record<string, GovernanceJsonValue>;
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    queuedAt?: string;
    sentAt?: string;
    deliveredAt?: string;
    failedAt?: string;
    cancelledAt?: string;
    suppressedAt?: string;
    error?: string;
}
export interface GovernanceTimelineEvent {
    id: string;
    sequence: number;
    aggregateType: string;
    aggregateId: string;
    type: GovernanceTimelineEventType;
    title: string;
    description?: string;
    actor: GovernanceActor;
    relatedResourceIds: string[];
    payload: Record<string, GovernanceJsonValue>;
    metadata: Record<string, GovernanceJsonValue>;
    createdAt: string;
}
export interface GovernanceOperationsSnapshot {
    schedules: number;
    activeSchedules: number;
    failedSchedules: number;
    scheduleRuns: number;
    failedScheduleRuns: number;
    escalations: number;
    openEscalations: number;
    criticalEscalations: number;
    notifications: number;
    pendingNotifications: number;
    failedNotifications: number;
    timelineEvents: number;
    generatedAt: string;
}
export interface GovernanceSnapshotSection {
    key: string;
    count: number;
    checksum: string;
    data: GovernanceJsonValue;
}
export interface GovernanceCheckpoint {
    id: string;
    checkpointNumber: string;
    key: string;
    name: string;
    description?: string;
    type: GovernanceCheckpointType;
    status: GovernanceCheckpointStatus;
    scope: GovernanceSnapshotScope;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    governanceRequestId?: string;
    changeExecutionId?: string;
    recoveryPlanId?: string;
    sections: GovernanceSnapshotSection[];
    rootChecksum: string;
    previousCheckpointId?: string;
    previousCheckpointChecksum?: string;
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    verifiedAt?: string;
    restoredAt?: string;
    archivedAt?: string;
    expiresAt?: string;
    invalidReason?: string;
}
export interface GovernanceCheckpointVerification {
    checkpointId: string;
    valid: boolean;
    checkedSections: number;
    invalidSections: string[];
    expectedRootChecksum: string;
    actualRootChecksum: string;
    verifiedAt: string;
}
export interface GovernanceRetentionPolicy {
    id: string;
    key: string;
    name: string;
    description?: string;
    status: GovernanceRetentionStatus;
    archiveTypes: GovernanceArchiveType[];
    classifications: GovernanceDataClassification[];
    retentionDays: number;
    archiveAfterDays?: number;
    compressAfterDays?: number;
    redactAfterDays?: number;
    deleteAfterDays?: number;
    legalHold: boolean;
    immutable: boolean;
    environment?: GovernanceEnvironment;
    namespace?: string;
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    activatedAt?: string;
    disabledAt?: string;
    archivedAt?: string;
}
export interface GovernanceRetentionEvaluation {
    id: string;
    policyId: string;
    resourceType: GovernanceArchiveType;
    resourceId: string;
    resourceCreatedAt: string;
    resourceAgeDays: number;
    classification: GovernanceDataClassification;
    action: GovernanceRetentionAction;
    reason: string;
    evaluatedAt: string;
}
export interface GovernanceArchive {
    id: string;
    archiveNumber: string;
    type: GovernanceArchiveType;
    status: GovernanceArchiveStatus;
    name: string;
    description?: string;
    classification: GovernanceDataClassification;
    environment?: GovernanceEnvironment;
    namespace?: string;
    sourceResourceIds: string[];
    checkpointId?: string;
    sections: GovernanceSnapshotSection[];
    recordCount: number;
    rootChecksum: string;
    compressed: boolean;
    encrypted: boolean;
    immutable: boolean;
    retentionPolicyId?: string;
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    readyAt?: string;
    verifiedAt?: string;
    restoredAt?: string;
    failedAt?: string;
    expiresAt?: string;
    deletedAt?: string;
    error?: string;
}
export interface GovernanceArchiveVerification {
    archiveId: string;
    valid: boolean;
    recordCount: number;
    checkedSections: number;
    invalidSections: string[];
    expectedRootChecksum: string;
    actualRootChecksum: string;
    verifiedAt: string;
}
export interface GovernanceRestorePlan {
    id: string;
    restoreNumber: string;
    name: string;
    description?: string;
    status: GovernanceRestoreStatus;
    archiveId?: string;
    checkpointId?: string;
    environment?: GovernanceEnvironment;
    namespace?: string;
    service?: string;
    targetScope: GovernanceSnapshotScope;
    dryRun: boolean;
    validations: RuntimeChangeValidation[];
    restoreSections: string[];
    conflictStrategy: "fail" | "overwrite" | "merge" | "skip_existing";
    metadata: Record<string, GovernanceJsonValue>;
    createdBy: GovernanceActor;
    createdAt: string;
    updatedAt: string;
    validatedAt?: string;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
    cancelledAt?: string;
    error?: string;
}
export interface GovernanceDataLifecycleSnapshot {
    checkpoints: number;
    verifiedCheckpoints: number;
    invalidCheckpoints: number;
    restoreReadyCheckpoints: number;
    retentionPolicies: number;
    activeRetentionPolicies: number;
    retentionEvaluations: number;
    archives: number;
    readyArchives: number;
    verifiedArchives: number;
    failedArchives: number;
    restorePlans: number;
    readyRestorePlans: number;
    successfulRestorePlans: number;
    failedRestorePlans: number;
    generatedAt: string;
}
