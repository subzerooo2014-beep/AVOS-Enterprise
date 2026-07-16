export type MeshServiceStatus =
  | "active"
  | "degraded"
  | "paused"
  | "offline";

export type MeshEndpointProtocol =
  | "http"
  | "https"
  | "grpc"
  | "event"
  | "internal";

export type MeshCircuitState =
  | "closed"
  | "open"
  | "half-open";

export interface MeshServiceRecord {
  id: string;
  name: string;
  version: string;
  domain: string;
  status: MeshServiceStatus;
  capabilityIds: string[];
  endpointIds: string[];
  tags: string[];
  zone: string;
  instanceCount: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MeshCapabilityEndpoint {
  id: string;
  serviceId: string;
  capabilityId: string;
  name: string;
  protocol: MeshEndpointProtocol;
  address: string;
  method?: string;
  timeoutMs: number;
  requiresAuthentication: boolean;
  requiresHumanApproval: boolean;
  permissions: string[];
  active: boolean;
  weight: number;
  priority: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MeshCommunicationPolicy {
  id: string;
  name: string;
  description: string;
  timeoutMs: number;
  maxAttempts: number;
  retryBackoffMs: number;
  circuitFailureThreshold: number;
  circuitResetMs: number;
  bulkheadConcurrency: number;
  requireTrace: boolean;
  requireIdentity: boolean;
  requireHumanApprovalForCritical: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MeshCircuitBreaker {
  id: string;
  endpointId: string;
  state: MeshCircuitState;
  failureCount: number;
  successCount: number;
  openedAt?: string;
  lastFailureAt?: string;
  lastSuccessAt?: string;
  updatedAt: string;
}

export interface MeshBulkhead {
  id: string;
  endpointId: string;
  limit: number;
  inFlight: number;
  rejected: number;
  updatedAt: string;
}

export interface MeshRouteDecision {
  id: string;
  capabilityId: string;
  selectedEndpointId?: string;
  candidateEndpointIds: string[];
  decision: "selected" | "blocked" | "unavailable" | "approval-required";
  reasons: string[];
  correlationId: string;
  createdAt: string;
}

export interface MeshInvocation {
  id: string;
  capabilityId: string;
  endpointId: string;
  callerIdentityId: string;
  payload: unknown;
  correlationId: string;
  traceId: string;
  attempt: number;
  status:
    | "created"
    | "running"
    | "completed"
    | "failed"
    | "blocked"
    | "timed-out";
  result?: unknown;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface MeshHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    registryScore: number;
    discoveryScore: number;
    routingScore: number;
    circuitScore: number;
    bulkheadScore: number;
    invocationScore: number;
    policyScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface MeshAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "service"
    | "endpoint"
    | "discovery"
    | "routing"
    | "circuit"
    | "bulkhead"
    | "invocation"
    | "policy"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
