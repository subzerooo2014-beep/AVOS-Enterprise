export type LiveStateStatus =
  | "active"
  | "stale"
  | "conflicted"
  | "offline";

export type StateChangeType =
  | "created"
  | "updated"
  | "deleted"
  | "reconciled"
  | "restored";

export type PresenceStatus =
  | "online"
  | "away"
  | "busy"
  | "offline";

export interface LiveStateRecord {
  id: string;
  namespace: string;
  key: string;
  value: unknown;
  version: number;
  vectorClock: Record<string, number>;
  ownerIdentityId: string;
  sourceNodeId: string;
  status: LiveStateStatus;
  checksum: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface StateChangeRecord {
  id: string;
  stateId: string;
  namespace: string;
  key: string;
  type: StateChangeType;
  fromVersion: number;
  toVersion: number;
  payload: unknown;
  actorIdentityId: string;
  sourceNodeId: string;
  correlationId: string;
  traceId: string;
  createdAt: string;
}

export interface StateSyncRequest {
  id: string;
  namespace: string;
  key: string;
  sourceNodeId: string;
  targetNodeId: string;
  expectedVersion?: number;
  payload: unknown;
  vectorClock: Record<string, number>;
  correlationId: string;
  traceId: string;
  status:
    | "created"
    | "applied"
    | "conflict"
    | "rejected"
    | "failed";
  reasons: string[];
  createdAt: string;
  completedAt?: string;
}

export interface PresenceRecord {
  id: string;
  identityId: string;
  nodeId: string;
  status: PresenceStatus;
  capabilities: string[];
  lastSeenAt: string;
  expiresAt: string;
  metadata: Record<string, unknown>;
}

export interface TelemetryMetric {
  id: string;
  sourceId: string;
  category:
    | "latency"
    | "throughput"
    | "error-rate"
    | "availability"
    | "state-lag"
    | "conflict-rate"
    | "presence";
  name: string;
  value: number;
  unit: string;
  labels: Record<string, string>;
  correlationId: string;
  capturedAt: string;
}

export interface StateConflict {
  id: string;
  namespace: string;
  key: string;
  localStateId?: string;
  incomingPayload: unknown;
  localVersion: number;
  incomingVersion: number;
  localVectorClock: Record<string, number>;
  incomingVectorClock: Record<string, number>;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "resolved" | "escalated";
  resolution?: string;
  resolvedByIdentityId?: string;
  correlationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationResult {
  id: string;
  conflictId: string;
  strategy:
    | "latest-version"
    | "merge"
    | "source-priority"
    | "human-decision";
  selectedVersion: number;
  mergedValue: unknown;
  humanApproved: boolean;
  resolvedByIdentityId: string;
  correlationId: string;
  createdAt: string;
}

export interface LiveCoordinationHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    stateScore: number;
    syncScore: number;
    changeFeedScore: number;
    presenceScore: number;
    telemetryScore: number;
    conflictScore: number;
    reconciliationScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface LiveCoordinationAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "state"
    | "sync"
    | "change"
    | "presence"
    | "telemetry"
    | "conflict"
    | "reconciliation"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
