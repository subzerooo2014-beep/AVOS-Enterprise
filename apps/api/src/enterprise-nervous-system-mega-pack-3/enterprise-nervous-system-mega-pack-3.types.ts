export type NervousWorkflowStatus =
  | "draft"
  | "active"
  | "paused"
  | "disabled";

export type NervousWorkflowExecutionStatus =
  | "created"
  | "running"
  | "waiting-human-approval"
  | "compensating"
  | "completed"
  | "failed"
  | "cancelled";

export type NervousWorkflowStepStatus =
  | "pending"
  | "ready"
  | "running"
  | "waiting-human-approval"
  | "completed"
  | "failed"
  | "compensated"
  | "skipped";

export type NervousWorkflowStepType =
  | "event"
  | "service"
  | "decision"
  | "delay"
  | "approval"
  | "compensation";

export interface NervousWorkflowStep {
  id: string;
  name: string;
  description: string;
  type: NervousWorkflowStepType;
  order: number;
  dependencies: string[];
  inputMapping: Record<string, string>;
  outputKey?: string;
  timeoutMs: number;
  retryAttempts: number;
  requiresHumanApproval: boolean;
  compensationStepId?: string;
  metadata: Record<string, unknown>;
}

export interface NervousWorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  triggerIds: string[];
  steps: NervousWorkflowStep[];
  status: NervousWorkflowStatus;
  reversible: boolean;
  maxExecutionMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface NervousWorkflowTrigger {
  id: string;
  name: string;
  workflowId: string;
  topicPattern: string;
  signalDefinitionId?: string;
  conditions: Array<{
    field: string;
    operator: "eq" | "neq" | "contains" | "gt" | "gte" | "lt" | "lte";
    value: unknown;
  }>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NervousWorkflowStepExecution {
  id: string;
  stepId: string;
  status: NervousWorkflowStepStatus;
  attempts: number;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
  approvedByIdentityId?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface NervousWorkflowExecution {
  id: string;
  workflowId: string;
  workflowVersion: string;
  triggerId?: string;
  correlationId: string;
  traceId: string;
  status: NervousWorkflowExecutionStatus;
  context: Record<string, unknown>;
  steps: NervousWorkflowStepExecution[];
  progress: number;
  startedByIdentityId: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface NervousWorkflowStateTransition {
  id: string;
  executionId: string;
  fromStatus: NervousWorkflowExecutionStatus;
  toStatus: NervousWorkflowExecutionStatus;
  reason: string;
  actorIdentityId: string;
  occurredAt: string;
}

export interface NervousSagaRecord {
  id: string;
  executionId: string;
  completedStepIds: string[];
  compensationStepIds: string[];
  status: "ready" | "compensating" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface NervousApprovalGate {
  id: string;
  executionId: string;
  stepId: string;
  reason: string;
  riskScore: number;
  status: "pending" | "approved" | "rejected";
  requestedByIdentityId: string;
  decidedByIdentityId?: string;
  decisionNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NervousWorkflowHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    registryScore: number;
    triggerScore: number;
    executionScore: number;
    stateScore: number;
    sagaScore: number;
    compensationScore: number;
    approvalScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface NervousWorkflowAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "workflow"
    | "trigger"
    | "execution"
    | "step"
    | "state"
    | "saga"
    | "compensation"
    | "approval"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
