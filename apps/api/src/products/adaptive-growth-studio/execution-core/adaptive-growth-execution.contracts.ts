export type AgsActionRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AgsExecutionState =
  | "draft"
  | "pending-approval"
  | "approved"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "rolled-back";

export type AgsExecutionEventType =
  | "action-created"
  | "action-validated"
  | "approval-required"
  | "execution-approved"
  | "execution-queued"
  | "execution-started"
  | "execution-completed"
  | "execution-failed"
  | "execution-cancelled"
  | "execution-retried"
  | "rollback-started"
  | "rollback-completed";

export interface AgsActionDefinition {
  key: string;
  name: string;
  description: string;
  capability: string;
  riskLevel: AgsActionRiskLevel;
  requiresApproval: boolean;
  supportsRollback: boolean;
  enabled: boolean;
  version: string;
}

export interface AgsCreateActionInput {
  definitionKey: string;
  title: string;
  objective: string;
  sourceType?: "recommendation" | "opportunity" | "manual";
  sourceId?: string;
  requestedBy?: string;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AgsAction {
  id: string;
  definitionKey: string;
  title: string;
  objective: string;
  sourceType: "recommendation" | "opportunity" | "manual";
  sourceId?: string;
  requestedBy: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
  state: AgsExecutionState;
  riskLevel: AgsActionRiskLevel;
  requiresApproval: boolean;
  supportsRollback: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgsExecutionResult {
  status: "success" | "failure";
  summary: string;
  output: Record<string, unknown>;
  metrics: Record<string, number>;
  completedAt: string;
}

export interface AgsExecutionRecord {
  id: string;
  actionId: string;
  definitionKey: string;
  state: AgsExecutionState;
  attempt: number;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  rolledBackAt?: string;
  result?: AgsExecutionResult;
  error?: string;
  rollbackResult?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AgsExecutionHistoryEntry {
  id: string;
  actionId: string;
  executionId?: string;
  eventType: AgsExecutionEventType;
  fromState?: AgsExecutionState;
  toState: AgsExecutionState;
  actor: string;
  reason?: string;
  evidence: Record<string, unknown>;
  createdAt: string;
}

export interface AgsValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  requiresApproval: boolean;
  riskLevel: AgsActionRiskLevel;
}