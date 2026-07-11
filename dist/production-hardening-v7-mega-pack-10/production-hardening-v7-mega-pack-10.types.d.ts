export type ReleaseStatus = "draft" | "evaluating" | "approved" | "rejected" | "deploying" | "deployed" | "rolled_back";
export type DeploymentStatus = "queued" | "running" | "completed" | "failed" | "rolled_back";
export type GateResult = "passed" | "failed" | "warning";
export type DeploymentStrategy = "rolling" | "blue_green" | "canary" | "recreate";
export interface ReleaseArtifact {
    id: string;
    releaseId: string;
    name: string;
    version: string;
    checksum: string;
    artifactType: string;
    sizeBytes: number;
    verified: boolean;
    createdAt: string;
    verifiedAt?: string;
}
export interface ReleaseGate {
    id: string;
    name: string;
    category: "security" | "quality" | "compliance" | "availability" | "performance" | "database" | "rollback";
    required: boolean;
    result: GateResult;
    score: number;
    message: string;
    evaluatedAt: string;
}
export interface ReleaseCandidate {
    id: string;
    name: string;
    version: string;
    environment: string;
    description: string;
    status: ReleaseStatus;
    strategy: DeploymentStrategy;
    requestedBy: string;
    approvedBy?: string;
    rejectedBy?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    deployedAt?: string;
    rolledBackAt?: string;
    artifactIds: string[];
    gateIds: string[];
}
export interface DeploymentStage {
    id: string;
    order: number;
    name: string;
    status: "pending" | "running" | "completed" | "failed" | "skipped";
    startedAt?: string;
    completedAt?: string;
    message: string;
}
export interface DeploymentExecution {
    id: string;
    releaseId: string;
    environment: string;
    strategy: DeploymentStrategy;
    status: DeploymentStatus;
    requestedBy: string;
    startedAt: string;
    completedAt?: string;
    durationMs?: number;
    stages: DeploymentStage[];
    rollbackExecutionId?: string;
    evidenceIds: string[];
}
export interface RollbackPlan {
    id: string;
    releaseId: string;
    name: string;
    targetVersion: string;
    automaticRollback: boolean;
    maximumErrorRatePercent: number;
    maximumLatencyMs: number;
    minimumHealthPercent: number;
    validated: boolean;
    createdAt: string;
    validatedAt?: string;
}
export interface ProductionReadinessAssessment {
    id: string;
    releaseId: string;
    overallScore: number;
    ready: boolean;
    blockers: string[];
    warnings: string[];
    evaluatedAt: string;
}
export interface ReleaseEvidenceEntry {
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
export interface ReleasePlatformEvent {
    id: string;
    eventType: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    payload: Record<string, unknown>;
}
export interface ReleaseGovernanceSnapshot {
    generatedAt: string;
    healthStatus: "healthy" | "degraded" | "critical";
    evidenceChainVerified: boolean;
    releases: number;
    approvedReleases: number;
    deployedReleases: number;
    rejectedReleases: number;
    rolledBackReleases: number;
    artifacts: number;
    verifiedArtifacts: number;
    releaseGates: number;
    passedGates: number;
    failedGates: number;
    rollbackPlans: number;
    validatedRollbackPlans: number;
    readinessAssessments: number;
    readyAssessments: number;
    deploymentExecutions: number;
    completedDeployments: number;
    failedDeployments: number;
    evidenceEntries: number;
    platformEvents: number;
}
