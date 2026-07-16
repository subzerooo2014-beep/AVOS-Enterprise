export type NervousSystemEventPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type NervousSystemEventState =
  | "published"
  | "routing"
  | "delivered"
  | "partially-delivered"
  | "failed"
  | "dead-lettered";

export type EventDeliveryStatus =
  | "pending"
  | "delivered"
  | "failed"
  | "dead-lettered";

export type OrchestrationPlanStatus =
  | "draft"
  | "ready"
  | "running"
  | "waiting-human-approval"
  | "completed"
  | "failed"
  | "cancelled";

export type OrchestrationStepStatus =
  | "pending"
  | "running"
  | "waiting-human-approval"
  | "completed"
  | "failed"
  | "skipped"
  | "cancelled";

export type OrchestrationExecutionMode =
  | "automatic"
  | "human-supervised"
  | "human-required";

export type HumanApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "cancelled";

export interface EventContractDefinition {
  id: string;
  eventType: string;
  version: string;
  description: string;
  producerCapabilityIds: string[];
  consumerCapabilityIds: string[];
  requiredPayloadFields: string[];
  sensitivePayloadFields: string[];
  retentionClass: "ephemeral" | "operational" | "audit" | "permanent";
  requiresTraceability: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NervousSystemEvent<TPayload = Record<string, unknown>> {
  id: string;
  eventType: string;
  eventVersion: string;
  sourceCapabilityId: string;
  sourceIdentityId: string;
  subjectId: string;
  correlationId: string;
  causationId?: string;
  priority: NervousSystemEventPriority;
  payload: TPayload;
  metadata: Record<string, unknown>;
  state: NervousSystemEventState;
  occurredAt: string;
  publishedAt: string;
}

export interface EventSubscription {
  id: string;
  name: string;
  eventTypePattern: string;
  targetCapabilityId: string;
  handlerKey: string;
  active: boolean;
  priority: number;
  maxAttempts: number;
  requiresHumanApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventDelivery {
  id: string;
  eventId: string;
  subscriptionId: string;
  targetCapabilityId: string;
  handlerKey: string;
  status: EventDeliveryStatus;
  attempt: number;
  maxAttempts: number;
  error?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrchestrationStepDefinition {
  id: string;
  name: string;
  capabilityId: string;
  action: string;
  dependsOnStepIds: string[];
  executionMode: OrchestrationExecutionMode;
  requiredApprovalRole?: string;
  timeoutMs: number;
  maxAttempts: number;
  input: Record<string, unknown>;
  compensationAction?: string;
}

export interface OrchestrationPlan {
  id: string;
  name: string;
  description: string;
  objective: string;
  correlationId: string;
  requestedByIdentityId: string;
  status: OrchestrationPlanStatus;
  steps: OrchestrationStepDefinition[];
  context: Record<string, unknown>;
  humanFinalAuthority: true;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface OrchestrationStepExecution {
  id: string;
  planId: string;
  stepId: string;
  capabilityId: string;
  action: string;
  status: OrchestrationStepStatus;
  attempt: number;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface HumanApprovalRequest {
  id: string;
  planId: string;
  stepId: string;
  requestedByIdentityId: string;
  requiredRole: string;
  reason: string;
  status: HumanApprovalStatus;
  approverIdentityId?: string;
  decisionNote?: string;
  requestedAt: string;
  decidedAt?: string;
  expiresAt?: string;
}

export interface DeadLetterRecord {
  id: string;
  sourceType: "event-delivery" | "orchestration-step";
  sourceId: string;
  correlationId: string;
  reason: string;
  attempts: number;
  payload: Record<string, unknown>;
  createdAt: string;
  replayedAt?: string;
}

export interface NervousSystemTraceRecord {
  id: string;
  correlationId: string;
  category:
    | "event"
    | "delivery"
    | "orchestration"
    | "execution"
    | "approval"
    | "recovery";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "pending" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
