export type ResilienceHealth = "healthy" | "degraded" | "critical";
export type SloStatus = "healthy" | "at_risk" | "exhausted";
export type ReleaseGateDecision = "approved" | "conditionally_approved" | "blocked";
export type ContinuityPlanStatus = "draft" | "active" | "testing" | "validated" | "failed" | "retired";
export type ChaosDrillStatus = "planned" | "running" | "passed" | "failed" | "cancelled";
export interface ResilienceEvent {
    id: string;
    eventType: string;
    entityType: string;
    entityId: string | null;
    severity: "info" | "warning" | "critical";
    message: string;
    metadata: Record<string, unknown>;
    createdAt: string;
}
export interface ServiceLevelObjective {
    id: string;
    code: string;
    name: string;
    description: string | null;
    service: string;
    indicator: string;
    targetPercentage: number;
    windowDays: number;
    warningThresholdPercentage: number;
    criticalThresholdPercentage: number;
    active: boolean;
    owner: string | null;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}
export interface SloSignal {
    id: string;
    sloId: string;
    successfulEvents: number;
    totalEvents: number;
    availabilityPercentage: number;
    latencyP95Ms: number | null;
    errorCount: number;
    impactMinutes: number;
    source: string;
    metadata: Record<string, unknown>;
    observedAt: string;
    createdAt: string;
}
export interface ErrorBudgetSnapshot {
    id: string;
    sloId: string;
    targetPercentage: number;
    actualPercentage: number;
    allowedFailurePercentage: number;
    consumedFailurePercentage: number;
    allowedMinutes: number;
    consumedMinutes: number;
    remainingMinutes: number;
    consumptionPercentage: number;
    status: SloStatus;
    calculatedAt: string;
}
export interface ResilienceIncident {
    id: string;
    title: string;
    service: string;
    severity: "low" | "medium" | "high" | "critical";
    status: "open" | "mitigating" | "resolved";
    impactMinutes: number;
    customerImpact: string | null;
    rootCause: string | null;
    remediation: string | null;
    startedAt: string;
    resolvedAt: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface ReleaseCandidate {
    id: string;
    version: string;
    environment: string;
    service: string;
    requestedBy: string | null;
    changeRiskScore: number;
    rollbackReady: boolean;
    monitoringReady: boolean;
    testCoveragePercentage: number;
    securityVerified: boolean;
    evidenceVerified: boolean;
    metadata: Record<string, unknown>;
    createdAt: string;
}
export interface ReleaseGateEvaluation {
    id: string;
    releaseCandidateId: string;
    decision: ReleaseGateDecision;
    score: number;
    blockers: string[];
    warnings: string[];
    passedChecks: string[];
    evaluatedAt: string;
}
export interface ContinuityPlan {
    id: string;
    code: string;
    name: string;
    service: string;
    owner: string | null;
    status: ContinuityPlanStatus;
    recoveryTimeObjectiveMinutes: number;
    recoveryPointObjectiveMinutes: number;
    maximumTolerableDowntimeMinutes: number;
    dependencies: string[];
    recoverySteps: string[];
    communicationSteps: string[];
    lastTestedAt: string | null;
    nextTestDueAt: string | null;
    lastObservedRecoveryMinutes: number | null;
    evidenceVerified: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ChaosDrill {
    id: string;
    name: string;
    service: string;
    scenario: string;
    expectedOutcome: string;
    status: ChaosDrillStatus;
    plannedAt: string;
    startedAt: string | null;
    completedAt: string | null;
    observedRecoveryMinutes: number | null;
    withinRto: boolean | null;
    findings: string[];
    remediationActions: string[];
    evidenceVerified: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ResilienceEvidence {
    id: string;
    evidenceType: string;
    entityType: string;
    entityId: string;
    payloadHash: string;
    previousHash: string | null;
    chainHash: string;
    verified: boolean;
    createdAt: string;
}
export interface ResilienceState {
    version: string;
    initializedAt: string;
    updatedAt: string;
    slos: ServiceLevelObjective[];
    signals: SloSignal[];
    errorBudgets: ErrorBudgetSnapshot[];
    incidents: ResilienceIncident[];
    releaseCandidates: ReleaseCandidate[];
    releaseEvaluations: ReleaseGateEvaluation[];
    continuityPlans: ContinuityPlan[];
    chaosDrills: ChaosDrill[];
    evidence: ResilienceEvidence[];
    events: ResilienceEvent[];
}
export interface ResilienceStatusResponse {
    success: true;
    system: string;
    version: string;
    healthStatus: ResilienceHealth;
    evidenceChainVerified: boolean;
    slos: number;
    activeSlos: number;
    healthySlos: number;
    atRiskSlos: number;
    exhaustedSlos: number;
    signals: number;
    incidents: number;
    openIncidents: number;
    releaseCandidates: number;
    releaseEvaluations: number;
    approvedReleases: number;
    blockedReleases: number;
    continuityPlans: number;
    validatedContinuityPlans: number;
    chaosDrills: number;
    failedChaosDrills: number;
    evidenceEntries: number;
    platformEvents: number;
    updatedAt: string;
}
