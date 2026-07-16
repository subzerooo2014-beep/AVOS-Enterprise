export type WorkflowStatus =
  | "DRAFT"
  | "RUNNING"
  | "WAITING_APPROVAL"
  | "WAITING_RETRY"
  | "COMPLETED"
  | "FAILED"
  | "COMPENSATING"
  | "COMPENSATED"
  | "CANCELLED"
  | "TIMED_OUT";

export type WorkflowStepStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "COMPENSATED"
  | "SKIPPED";

export interface WorkflowStepDefinition {
  id: string;
  name: string;
  order: number;
  requiresApproval?: boolean;
  timeoutMs?: number;
  retryLimit?: number;
  compensationStepId?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  description?: string;
  enabled: boolean;
  steps: WorkflowStepDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStepExecution {
  stepId: string;
  status: WorkflowStepStatus;
  attempts: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface WorkflowExecution {
  id: string;
  definitionId: string;
  definitionVersion: string;
  correlationId?: string;
  status: WorkflowStatus;
  currentStepId?: string;
  context: Record<string, unknown>;
  steps: WorkflowStepExecution[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface ApprovalRequest {
  id: string;
  workflowExecutionId: string;
  stepId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  reason?: string;
}

export interface WorkflowEvent {
  id: string;
  type: string;
  workflowExecutionId: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface WorkflowMetrics {
  definitions: number;
  executions: number;
  running: number;
  completed: number;
  failed: number;
  compensated: number;
  timedOut: number;
  pendingApprovals: number;
  events: number;
}
