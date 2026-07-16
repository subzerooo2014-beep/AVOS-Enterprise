export type KernelComponentHealthStatus =
  | "unknown"
  | "healthy"
  | "degraded"
  | "unhealthy"
  | "critical"
  | "isolated"
  | "recovering";

export type KernelFailureSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical"
  | "fatal";

export type KernelFailureCategory =
  | "runtime"
  | "dependency"
  | "configuration"
  | "security"
  | "policy"
  | "resource"
  | "network"
  | "storage"
  | "module"
  | "unknown";

export type KernelRecoveryActionType =
  | "retry"
  | "restart"
  | "isolate"
  | "restore-config"
  | "rollback"
  | "degrade"
  | "safe-mode"
  | "manual-intervention";

export type KernelRecoveryStatus =
  | "planned"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type KernelOperationalMode =
  | "normal"
  | "degraded"
  | "safe"
  | "maintenance"
  | "emergency";

export interface KernelHealthSignal {
  id: string;
  componentId: string;
  status: KernelComponentHealthStatus;
  score: number;
  source: string;
  message: string;
  metrics: Record<string, number>;
  metadata: Record<string, unknown>;
  observedAt: string;
}

export interface KernelComponentHealthRecord {
  id: string;
  componentId: string;
  componentName: string;
  status: KernelComponentHealthStatus;
  score: number;
  lastSignalId?: string;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  isolated: boolean;
  recoveryInProgress: boolean;
  metadata: Record<string, unknown>;
  updatedAt: string;
}

export interface KernelFailureRecord {
  id: string;
  componentId: string;
  category: KernelFailureCategory;
  severity: KernelFailureSeverity;
  code: string;
  message: string;
  recoverable: boolean;
  retryable: boolean;
  requiresIsolation: boolean;
  requiresHumanApproval: boolean;
  context: Record<string, unknown>;
  correlationId: string;
  occurredAt: string;
}

export interface KernelDiagnosticFinding {
  id: string;
  componentId: string;
  severity: KernelFailureSeverity;
  code: string;
  title: string;
  description: string;
  probableCauses: string[];
  recommendedActions: KernelRecoveryActionType[];
  evidence: Record<string, unknown>;
  createdAt: string;
}

export interface KernelIsolationRecord {
  id: string;
  componentId: string;
  reason: string;
  isolatedByIdentityId: string;
  correlationId: string;
  active: boolean;
  isolatedAt: string;
  releasedAt?: string;
  releasedByIdentityId?: string;
}

export interface KernelRecoveryStep {
  id: string;
  order: number;
  action: KernelRecoveryActionType;
  description: string;
  required: boolean;
  status:
    | "pending"
    | "running"
    | "completed"
    | "failed"
    | "skipped";
  startedAt?: string;
  completedAt?: string;
  result?: unknown;
  error?: string;
}

export interface KernelRecoveryPlan {
  id: string;
  failureId: string;
  componentId: string;
  risk: "low" | "medium" | "high" | "critical";
  requiresHumanApproval: boolean;
  approvedByIdentityId?: string;
  status: KernelRecoveryStatus;
  steps: KernelRecoveryStep[];
  createdByIdentityId: string;
  correlationId: string;
  createdAt: string;
  completedAt?: string;
}

export interface KernelRestartPolicy {
  id: string;
  componentId: string;
  enabled: boolean;
  maxAttempts: number;
  windowSeconds: number;
  delayMilliseconds: number;
  backoffMultiplier: number;
  isolateAfterExhaustion: boolean;
  enterSafeModeAfterExhaustion: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelRestartAttempt {
  id: string;
  policyId: string;
  componentId: string;
  attempt: number;
  successful: boolean;
  reason: string;
  correlationId: string;
  attemptedAt: string;
}

export interface KernelModeTransition {
  id: string;
  fromMode: KernelOperationalMode;
  toMode: KernelOperationalMode;
  reason: string;
  actorIdentityId: string;
  correlationId: string;
  humanApproved: boolean;
  occurredAt: string;
}

export interface KernelDiagnosticSnapshot {
  id: string;
  mode: KernelOperationalMode;
  healthRecords: KernelComponentHealthRecord[];
  failures: KernelFailureRecord[];
  findings: KernelDiagnosticFinding[];
  isolations: KernelIsolationRecord[];
  recoveryPlans: KernelRecoveryPlan[];
  restartAttempts: KernelRestartAttempt[];
  createdByIdentityId: string;
  correlationId: string;
  createdAt: string;
}

export interface KernelRecoveryReadinessAssessment {
  id: string;
  ready: boolean;
  score: number;
  blockers: string[];
  warnings: string[];
  healthyComponents: number;
  totalComponents: number;
  activeFailures: number;
  activeIsolations: number;
  failedRecoveries: number;
  operationalMode: KernelOperationalMode;
  assessedAt: string;
}

export interface KernelResilienceHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    componentHealthScore: number;
    diagnosticsScore: number;
    recoveryScore: number;
    isolationScore: number;
    restartPolicyScore: number;
    modeSafetyScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface KernelResilienceAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "health"
    | "diagnostics"
    | "failure"
    | "isolation"
    | "recovery"
    | "restart"
    | "mode"
    | "snapshot"
    | "readiness";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
