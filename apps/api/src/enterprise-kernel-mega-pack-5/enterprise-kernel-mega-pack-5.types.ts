export type KernelMessageKind =
  | "event"
  | "command"
  | "query";

export type KernelMessageStatus =
  | "created"
  | "queued"
  | "processing"
  | "delivered"
  | "completed"
  | "failed"
  | "dead-lettered"
  | "replayed";

export type KernelDeliveryGuarantee =
  | "at-most-once"
  | "at-least-once"
  | "exactly-once-simulated";

export type KernelExecutionStepStatus =
  | "pending"
  | "ready"
  | "running"
  | "waiting-approval"
  | "completed"
  | "failed"
  | "compensating"
  | "compensated"
  | "skipped";

export type KernelExecutionPlanStatus =
  | "draft"
  | "ready"
  | "running"
  | "waiting-approval"
  | "completed"
  | "failed"
  | "compensating"
  | "compensated"
  | "cancelled";

export interface KernelMessageContract {
  id: string;
  name: string;
  kind: KernelMessageKind;
  version: string;
  schema: Record<string, unknown>;
  requiredFields: string[];
  producerIds: string[];
  consumerIds: string[];
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelMessageEnvelope {
  id: string;
  contractId: string;
  kind: KernelMessageKind;
  name: string;
  version: string;
  payload: Record<string, unknown>;
  headers: Record<string, string>;
  correlationId: string;
  causationId?: string;
  traceId: string;
  producerId: string;
  status: KernelMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface KernelSubscription {
  id: string;
  contractId: string;
  consumerId: string;
  active: boolean;
  priority: number;
  maxRetries: number;
  retryDelayMilliseconds: number;
  deliveryGuarantee: KernelDeliveryGuarantee;
  requiresHumanApproval: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelDeliveryAttempt {
  id: string;
  messageId: string;
  subscriptionId: string;
  attempt: number;
  status: "pending" | "delivered" | "failed" | "dead-lettered";
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface KernelDeadLetter {
  id: string;
  messageId: string;
  subscriptionId: string;
  reason: string;
  attempts: number;
  replayed: boolean;
  replayCount: number;
  createdAt: string;
  replayedAt?: string;
}

export interface KernelCommandResult {
  id: string;
  commandMessageId: string;
  handledBy: string;
  success: boolean;
  result?: unknown;
  error?: string;
  completedAt: string;
}

export interface KernelQueryResult {
  id: string;
  queryMessageId: string;
  handledBy: string;
  success: boolean;
  data?: unknown;
  error?: string;
  completedAt: string;
}

export interface KernelExecutionStep {
  id: string;
  name: string;
  order: number;
  dependencies: string[];
  commandContractId: string;
  payload: Record<string, unknown>;
  compensationCommandContractId?: string;
  compensationPayload?: Record<string, unknown>;
  timeoutMilliseconds: number;
  retryLimit: number;
  requiresHumanApproval: boolean;
  status: KernelExecutionStepStatus;
  startedAt?: string;
  completedAt?: string;
  result?: unknown;
  error?: string;
}

export interface KernelExecutionPlan {
  id: string;
  name: string;
  description: string;
  status: KernelExecutionPlanStatus;
  steps: KernelExecutionStep[];
  correlationId: string;
  traceId: string;
  createdByIdentityId: string;
  approvedByIdentityId?: string;
  reversible: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface KernelOrchestrationTrace {
  id: string;
  planId: string;
  stepId?: string;
  event: string;
  status: string;
  details: Record<string, unknown>;
  correlationId: string;
  traceId: string;
  occurredAt: string;
}

export interface KernelMessagingHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    contractScore: number;
    deliveryScore: number;
    retryScore: number;
    deadLetterScore: number;
    orchestrationScore: number;
    traceabilityScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface KernelMessagingAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "contract"
    | "event"
    | "command"
    | "query"
    | "delivery"
    | "dead-letter"
    | "orchestration"
    | "execution"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
