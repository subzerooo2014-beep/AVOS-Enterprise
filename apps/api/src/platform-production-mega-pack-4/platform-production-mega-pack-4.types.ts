export type EventDeliveryMode = "at-most-once" | "at-least-once" | "exactly-once";
export type EventPriority = "low" | "normal" | "high" | "critical";

export interface EventContract {
  id: string;
  eventType: string;
  version: string;
  schema: Record<string, unknown>;
  owner: string;
  active: boolean;
  deliveryMode: EventDeliveryMode;
  createdAt: string;
  updatedAt: string;
}

export interface EventEnvelope {
  id: string;
  eventType: string;
  version: string;
  source: string;
  subject: string;
  correlationId: string;
  causationId?: string;
  priority: EventPriority;
  payload: Record<string, unknown>;
  headers: Record<string, string>;
  createdAt: string;
}

export interface EventRoute {
  id: string;
  eventType: string;
  destination: string;
  enabled: boolean;
  filter?: Record<string, unknown>;
  priority: number;
  createdAt: string;
}

export interface EventStreamRecord {
  id: string;
  streamKey: string;
  sequence: number;
  envelope: EventEnvelope;
  persistedAt: string;
}

export interface WorkflowBinding {
  id: string;
  workflowKey: string;
  triggerEventType: string;
  active: boolean;
  action: string;
  createdAt: string;
}

export interface CoordinationLease {
  id: string;
  resourceKey: string;
  owner: string;
  status: "active" | "released" | "expired";
  acquiredAt: string;
  expiresAt: string;
  releasedAt?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerEventType: string;
  condition?: Record<string, unknown>;
  action: string;
  active: boolean;
  createdAt: string;
}

export interface DeadLetterRecord {
  id: string;
  envelope: EventEnvelope;
  destination: string;
  attempts: number;
  reason: string;
  status: "pending" | "replayed" | "discarded";
  createdAt: string;
  replayedAt?: string;
}

export interface EventObservation {
  id: string;
  eventId: string;
  eventType: string;
  destination?: string;
  stage:
    | "published"
    | "validated"
    | "routed"
    | "delivered"
    | "failed"
    | "dead-lettered"
    | "replayed";
  success: boolean;
  durationMs: number;
  detail?: string;
  createdAt: string;
}

export interface EventMeshHealth {
  id: string;
  score: number;
  state: "healthy" | "degraded" | "critical";
  contracts: number;
  routes: number;
  streams: number;
  workflowBindings: number;
  automationRules: number;
  activeLeases: number;
  deadLettersPending: number;
  observations: number;
  blockingIssues: string[];
  createdAt: string;
}

export interface ProductionCertification {
  id: string;
  version: string;
  status: "not-certified" | "certified" | "rejected";
  score: number;
  approvedBy?: string;
  checks: Record<string, boolean>;
  createdAt: string;
}