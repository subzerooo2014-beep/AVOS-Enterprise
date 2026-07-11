export type AssuranceSeverity = "informational" | "low" | "medium" | "high" | "critical";
export type AssuranceStatus = "healthy" | "warning" | "degraded" | "critical" | "unknown";
export type ControlValidationStatus = "passed" | "failed" | "warning" | "not_applicable";
export type RiskStatus = "identified" | "assessed" | "mitigating" | "accepted" | "transferred" | "closed";
export type IncidentReadinessStatus = "ready" | "partially_ready" | "not_ready";
export type KeyLifecycleStatus = "planned" | "active" | "rotation_due" | "rotating" | "retired" | "revoked";
export type RemediationStatus = "open" | "in_progress" | "blocked" | "completed" | "cancelled";
export interface StoredRecord {
    id: string;
    createdAt: string;
    updatedAt: string;
}
export interface ControlDefinition extends StoredRecord {
    controlCode: string;
    name: string;
    description: string;
    framework: string;
    category: string;
    severity: AssuranceSeverity;
    enabled: boolean;
    validationType: string;
    expectedValue?: unknown;
    metadata: Record<string, unknown>;
}
export interface ControlValidationResult extends StoredRecord {
    runId: string;
    controlId: string;
    controlCode: string;
    status: ControlValidationStatus;
    observedValue?: unknown;
    expectedValue?: unknown;
    message: string;
    evidenceReferences: string[];
    durationMs: number;
}
export interface AssuranceRun extends StoredRecord {
    status: AssuranceStatus;
    startedAt: string;
    completedAt: string;
    totalControls: number;
    passedControls: number;
    warningControls: number;
    failedControls: number;
    score: number;
    results: ControlValidationResult[];
    trigger: string;
}
export interface ComplianceDriftEvent extends StoredRecord {
    fingerprint: string;
    domain: string;
    resource: string;
    previousState?: unknown;
    currentState?: unknown;
    severity: AssuranceSeverity;
    status: "open" | "acknowledged" | "resolved" | "ignored";
    detectedAt: string;
    resolvedAt?: string;
    description: string;
}
export interface EnterpriseRisk extends StoredRecord {
    riskCode: string;
    title: string;
    description: string;
    category: string;
    owner: string;
    likelihood: number;
    impact: number;
    inherentScore: number;
    residualScore: number;
    severity: AssuranceSeverity;
    status: RiskStatus;
    controls: string[];
    treatmentPlan?: string;
    reviewDate?: string;
    metadata: Record<string, unknown>;
}
export interface IncidentReadinessAssessment extends StoredRecord {
    assessmentName: string;
    status: IncidentReadinessStatus;
    score: number;
    assessedAt: string;
    capabilities: Array<{
        capability: string;
        ready: boolean;
        score: number;
        notes: string;
    }>;
    recommendations: string[];
}
export interface CryptographicKeyRecord extends StoredRecord {
    keyAlias: string;
    purpose: string;
    algorithm: string;
    provider: string;
    status: KeyLifecycleStatus;
    activatedAt?: string;
    rotationDueAt?: string;
    retiredAt?: string;
    revokedAt?: string;
    fingerprint?: string;
    version: number;
    metadata: Record<string, unknown>;
}
export interface RetentionPolicy extends StoredRecord {
    policyCode: string;
    resourceType: string;
    retentionDays: number;
    archiveAfterDays?: number;
    purgeAfterDays?: number;
    legalHoldSupported: boolean;
    enabled: boolean;
    description: string;
}
export interface RemediationPlan extends StoredRecord {
    sourceType: "control_failure" | "compliance_drift" | "risk" | "incident";
    sourceId: string;
    title: string;
    description: string;
    severity: AssuranceSeverity;
    status: RemediationStatus;
    owner: string;
    priority: number;
    dueAt?: string;
    actions: Array<{
        id: string;
        description: string;
        completed: boolean;
        completedAt?: string;
    }>;
}
export interface AssuranceReport extends StoredRecord {
    reportType: "continuous_assurance" | "executive" | "technical";
    generatedAt: string;
    overallStatus: AssuranceStatus;
    assuranceScore: number;
    riskScore: number;
    readinessScore: number;
    openDriftEvents: number;
    openRemediations: number;
    summary: Record<string, unknown>;
    recommendations: string[];
}
