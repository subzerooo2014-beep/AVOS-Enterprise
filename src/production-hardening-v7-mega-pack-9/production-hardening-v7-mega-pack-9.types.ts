export type ResilienceProfileStatus =
  | "draft"
  | "active"
  | "suspended"
  | "retired";

export type RecoveryPlanStatus =
  | "draft"
  | "approved"
  | "active"
  | "paused"
  | "retired";

export type RecoveryExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "partially_completed"
  | "failed"
  | "cancelled";

export type ExerciseStatus =
  | "planned"
  | "running"
  | "passed"
  | "failed"
  | "cancelled";

export type DependencyHealthStatus =
  | "healthy"
  | "degraded"
  | "unavailable"
  | "unknown";

export type CheckpointStatus =
  | "created"
  | "verified"
  | "restored"
  | "invalid";

export type RecoveryDecision =
  | "no_action"
  | "monitor"
  | "degrade_service"
  | "restart_component"
  | "failover"
  | "restore_checkpoint"
  | "isolate_dependency"
  | "escalate";

export interface ResilienceObjective {
  serviceName: string;
  recoveryTimeObjectiveMinutes: number;
  recoveryPointObjectiveMinutes: number;
  minimumAvailabilityPercent: number;
  maximumErrorRatePercent: number;
  priority: number;
}

export interface ResilienceProfile {
  id: string;
  name: string;
  description: string;
  environment: string;
  status: ResilienceProfileStatus;
  objectives: ResilienceObjective[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;
}

export interface RecoveryStep {
  id: string;
  order: number;
  name: string;
  description: string;
  action:
    | "health_check"
    | "restart"
    | "failover"
    | "restore"
    | "isolate"
    | "notify"
    | "verify";
  target: string;
  timeoutSeconds: number;
  required: boolean;
}

export interface RecoveryPlan {
  id: string;
  profileId: string;
  name: string;
  description: string;
  status: RecoveryPlanStatus;
  triggerTypes: string[];
  steps: RecoveryStep[];
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecoveryStepResult {
  stepId: string;
  order: number;
  name: string;
  action: string;
  target: string;
  status: "completed" | "failed" | "skipped";
  startedAt: string;
  completedAt: string;
  durationMs: number;
  message: string;
}

export interface RecoveryExecution {
  id: string;
  planId: string;
  profileId: string;
  reason: string;
  requestedBy: string;
  status: RecoveryExecutionStatus;
  decision: RecoveryDecision;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  stepResults: RecoveryStepResult[];
  evidenceIds: string[];
}

export interface ContinuityExercise {
  id: string;
  profileId: string;
  planId: string;
  name: string;
  scenario: string;
  scheduledAt: string;
  status: ExerciseStatus;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  findings: string[];
  executionId?: string;
  createdAt: string;
}

export interface DependencyHealth {
  id: string;
  serviceName: string;
  dependencyName: string;
  endpoint?: string;
  status: DependencyHealthStatus;
  latencyMs: number;
  consecutiveFailures: number;
  lastCheckedAt: string;
  lastHealthyAt?: string;
  message: string;
}

export interface ServiceCheckpoint {
  id: string;
  profileId: string;
  serviceName: string;
  version: string;
  status: CheckpointStatus;
  checksum: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  verifiedAt?: string;
  restoredAt?: string;
}

export interface FailureSimulation {
  id: string;
  profileId: string;
  name: string;
  failureType:
    | "latency"
    | "dependency_failure"
    | "resource_exhaustion"
    | "service_unavailable"
    | "data_corruption";
  target: string;
  severity: "low" | "medium" | "high" | "critical";
  durationSeconds: number;
  status: "created" | "running" | "completed" | "cancelled";
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  findings: string[];
}

export interface ResilienceEvidenceEntry {
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

export interface ResiliencePlatformEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface ResilienceSnapshot {
  generatedAt: string;
  healthStatus: "healthy" | "degraded" | "critical";
  evidenceChainVerified: boolean;
  profiles: number;
  activeProfiles: number;
  recoveryPlans: number;
  activeRecoveryPlans: number;
  recoveryExecutions: number;
  completedRecoveries: number;
  failedRecoveries: number;
  continuityExercises: number;
  passedExercises: number;
  dependencyChecks: number;
  degradedDependencies: number;
  unavailableDependencies: number;
  checkpoints: number;
  verifiedCheckpoints: number;
  failureSimulations: number;
  evidenceEntries: number;
  platformEvents: number;
}
