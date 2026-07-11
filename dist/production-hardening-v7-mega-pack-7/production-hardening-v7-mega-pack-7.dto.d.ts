export declare class CreateSloDto {
    code: string;
    name: string;
    description?: string;
    service: string;
    indicator: string;
    targetPercentage: number;
    windowDays: number;
    warningThresholdPercentage?: number;
    criticalThresholdPercentage?: number;
    owner?: string;
    tags?: string[];
}
export declare class RecordSloSignalDto {
    successfulEvents: number;
    totalEvents: number;
    latencyP95Ms?: number;
    errorCount?: number;
    impactMinutes?: number;
    source: string;
    metadata?: Record<string, unknown>;
    observedAt?: string;
}
export declare class CreateResilienceIncidentDto {
    title: string;
    service: string;
    severity: "low" | "medium" | "high" | "critical";
    impactMinutes?: number;
    customerImpact?: string;
    startedAt?: string;
}
export declare class ResolveResilienceIncidentDto {
    rootCause: string;
    remediation: string;
    impactMinutes?: number;
}
export declare class EvaluateReleaseDto {
    version: string;
    environment: string;
    service: string;
    requestedBy?: string;
    changeRiskScore: number;
    rollbackReady: boolean;
    monitoringReady: boolean;
    testCoveragePercentage: number;
    securityVerified: boolean;
    evidenceVerified: boolean;
    metadata?: Record<string, unknown>;
}
export declare class CreateContinuityPlanDto {
    code: string;
    name: string;
    service: string;
    owner?: string;
    recoveryTimeObjectiveMinutes: number;
    recoveryPointObjectiveMinutes: number;
    maximumTolerableDowntimeMinutes: number;
    dependencies?: string[];
    recoverySteps: string[];
    communicationSteps?: string[];
    nextTestDueAt?: string;
}
export declare class TestContinuityPlanDto {
    observedRecoveryMinutes: number;
    evidenceVerified: boolean;
    findings?: string[];
}
export declare class CreateChaosDrillDto {
    name: string;
    service: string;
    scenario: string;
    expectedOutcome: string;
    plannedAt?: string;
}
export declare class CompleteChaosDrillDto {
    status: "passed" | "failed";
    observedRecoveryMinutes: number;
    evidenceVerified: boolean;
    findings?: string[];
    remediationActions?: string[];
}
