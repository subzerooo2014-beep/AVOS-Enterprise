export type ServiceHealth = "healthy" | "degraded" | "critical" | "offline" | "recovering";
export type DependencyType = "database" | "cache" | "queue" | "api" | "storage" | "identity" | "network" | "external";
export type DependencyStatus = "available" | "degraded" | "unavailable";
export type IncidentPriority = "low" | "medium" | "high" | "critical";
export type IncidentLifecycle = "detected" | "analyzing" | "diagnosed" | "recovering" | "resolved" | "failed";
export type RootCauseCategory = "capacity" | "dependency" | "configuration" | "deployment" | "database" | "network" | "security" | "unknown";
export type RecoveryActionType = "restart_service" | "scale_up" | "scale_down" | "reroute_traffic" | "clear_cache" | "pause_deployments" | "activate_fallback" | "restore_checkpoint" | "isolate_dependency" | "monitor_only";
export interface ManagedService {
    id: string;
    serviceName: string;
    environment: string;
    region: string;
    owner: string;
    health: ServiceHealth;
    version: string;
    instances: number;
    minimumInstances: number;
    maximumInstances: number;
    requestRate: number;
    latencyMs: number;
    errorRatePercent: number;
    healthScore: number;
    createdAt: string;
    updatedAt: string;
}
export interface ServiceDependency {
    id: string;
    sourceServiceId: string;
    targetName: string;
    dependencyType: DependencyType;
    critical: boolean;
    status: DependencyStatus;
    latencyMs: number;
    errorRatePercent: number;
    lastCheckedAt: string;
    createdAt: string;
}
export interface DependencyGraphEdge {
    id: string;
    sourceServiceId: string;
    targetReference: string;
    relationship: string;
    criticalityScore: number;
    propagatedRiskScore: number;
    createdAt: string;
}
export interface OperationsIncident {
    id: string;
    title: string;
    serviceId: string;
    priority: IncidentPriority;
    lifecycle: IncidentLifecycle;
    healthScoreAtDetection: number;
    description: string;
    detectedAt: string;
    diagnosedAt?: string;
    recoveryStartedAt?: string;
    resolvedAt?: string;
    rootCauseAnalysisId?: string;
    recoveryExecutionIds: string[];
}
export interface RootCauseAnalysis {
    id: string;
    incidentId: string;
    serviceId: string;
    category: RootCauseCategory;
    confidencePercent: number;
    summary: string;
    contributingFactors: string[];
    recommendedActions: RecoveryActionType[];
    generatedAt: string;
}
export interface RecoveryPlan {
    id: string;
    name: string;
    serviceId: string;
    incidentPriority: IncidentPriority;
    active: boolean;
    actions: RecoveryActionType[];
    automaticExecution: boolean;
    minimumConfidencePercent: number;
    createdAt: string;
}
export interface RecoveryExecution {
    id: string;
    incidentId: string;
    recoveryPlanId: string;
    serviceId: string;
    action: RecoveryActionType;
    status: "pending" | "running" | "completed" | "failed";
    beforeHealth: ServiceHealth;
    afterHealth?: ServiceHealth;
    beforeInstances: number;
    afterInstances?: number;
    reason: string;
    startedAt: string;
    completedAt?: string;
    failureReason?: string;
}
export interface OperationsDecision {
    id: string;
    incidentId: string;
    serviceId: string;
    decision: "observe" | "diagnose" | "recover" | "escalate" | "block_change" | "close_incident";
    confidencePercent: number;
    reason: string;
    decidedAt: string;
}
export interface OperationsEvidenceEntry {
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
export interface OperationsPlatformEvent {
    id: string;
    eventType: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    payload: Record<string, unknown>;
}
export interface V8MegaPack2Snapshot {
    generatedAt: string;
    healthStatus: "healthy" | "degraded" | "critical";
    evidenceChainVerified: boolean;
    managedServices: number;
    healthyServices: number;
    degradedServices: number;
    criticalServices: number;
    dependencies: number;
    availableDependencies: number;
    degradedDependencies: number;
    unavailableDependencies: number;
    dependencyGraphEdges: number;
    incidents: number;
    resolvedIncidents: number;
    failedIncidents: number;
    rootCauseAnalyses: number;
    recoveryPlans: number;
    activeRecoveryPlans: number;
    recoveryExecutions: number;
    completedRecoveries: number;
    failedRecoveries: number;
    operationsDecisions: number;
    evidenceEntries: number;
    platformEvents: number;
}
