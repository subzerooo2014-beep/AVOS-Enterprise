export type EvolutionRequestStatus =
  | "draft"
  | "submitted"
  | "under-analysis"
  | "approved"
  | "rejected"
  | "planned"
  | "executing"
  | "completed"
  | "rolled-back"
  | "failed";

export type EvolutionChangeType =
  | "add"
  | "modify"
  | "remove"
  | "replace"
  | "upgrade"
  | "deprecate"
  | "migrate";

export type EvolutionRiskLevel =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type EvolutionPlanStatus =
  | "draft"
  | "ready"
  | "waiting-approval"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rolled-back"
  | "cancelled";

export type EvolutionStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
  | "rolled-back";

export type EvolutionApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export interface ArchitectureEvolutionChange {
  id: string;
  assetId: string;
  changeType: EvolutionChangeType;
  currentVersion?: string;
  targetVersion?: string;
  description: string;
  reason: string;
  dependenciesAffected: string[];
  contractsAffected: string[];
  metadata: Record<string, unknown>;
}

export interface ArchitectureEvolutionRequest {
  id: string;
  title: string;
  description: string;
  blueprintId: string;
  requestedByIdentityId: string;
  correlationId: string;
  status: EvolutionRequestStatus;
  objective: string;
  changes: ArchitectureEvolutionChange[];
  businessJustification: string;
  architectureJustification: string;
  constraints: string[];
  requiresHumanApproval: true;
  createdAt: string;
  updatedAt: string;
}

export interface EvolutionAnalysisResult {
  id: string;
  requestId: string;
  blueprintId: string;
  riskScore: number;
  riskLevel: EvolutionRiskLevel;
  impactedAssetIds: string[];
  criticalAssetIds: string[];
  breakingChanges: string[];
  compatibilityRisks: string[];
  dependencyRisks: string[];
  governanceRisks: string[];
  recommendations: string[];
  safeToProceed: boolean;
  analyzedByIdentityId: string;
  analyzedAt: string;
}

export interface EvolutionPlanStep {
  id: string;
  name: string;
  description: string;
  action: string;
  targetAssetId: string;
  dependsOnStepIds: string[];
  rollbackAction: string;
  timeoutMs: number;
  maxAttempts: number;
  status: EvolutionStepStatus;
  metadata: Record<string, unknown>;
}

export interface ArchitectureEvolutionPlan {
  id: string;
  requestId: string;
  blueprintId: string;
  name: string;
  description: string;
  status: EvolutionPlanStatus;
  steps: EvolutionPlanStep[];
  createdByIdentityId: string;
  approvedByIdentityId?: string;
  currentStepId?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvolutionApprovalRequest {
  id: string;
  requestId: string;
  planId: string;
  requestedByIdentityId: string;
  requiredRole: string;
  reason: string;
  status: EvolutionApprovalStatus;
  approverIdentityId?: string;
  decisionNote?: string;
  requestedAt: string;
  decidedAt?: string;
}

export interface EvolutionExecutionRecord {
  id: string;
  planId: string;
  stepId: string;
  attempt: number;
  status: EvolutionStepStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface EvolutionRollbackRecord {
  id: string;
  planId: string;
  stepId: string;
  rollbackAction: string;
  reason: string;
  executedByIdentityId: string;
  status: "pending" | "completed" | "failed";
  output?: Record<string, unknown>;
  error?: string;
  executedAt: string;
}

export interface EvolutionHistoryRecord {
  id: string;
  requestId: string;
  planId?: string;
  blueprintId: string;
  action: string;
  actorIdentityId: string;
  previousStatus?: string;
  nextStatus?: string;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

export interface EvolutionAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "request"
    | "analysis"
    | "plan"
    | "approval"
    | "execution"
    | "rollback"
    | "history";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked" | "pending";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
