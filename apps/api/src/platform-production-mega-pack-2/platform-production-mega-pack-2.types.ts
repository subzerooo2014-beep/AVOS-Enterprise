export type MeshServiceStatus =
  | "registered"
  | "healthy"
  | "degraded"
  | "unavailable"
  | "certified";

export interface MeshServiceInstance {
  id: string;
  serviceKey: string;
  serviceName: string;
  version: string;
  host: string;
  port: number;
  protocol: "http" | "https" | "grpc" | "event";
  environment: "development" | "test" | "staging" | "production";
  status: MeshServiceStatus;
  weight: number;
  priority: number;
  region: string;
  zone: string;
  tags: string[];
  capabilities: string[];
  healthScore: number;
  currentConnections: number;
  maxConnections: number;
  lastHeartbeatAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceContract {
  id: string;
  serviceKey: string;
  name: string;
  version: string;
  transport: "http" | "grpc" | "event";
  requestSchema: Record<string, unknown>;
  responseSchema: Record<string, unknown>;
  timeoutMs: number;
  idempotent: boolean;
  authRequired: boolean;
  requiredScopes: string[];
  compatibility: "backward" | "forward" | "full";
  approvedBy?: string;
  status: "draft" | "active" | "deprecated";
  createdAt: string;
}

export interface RoutingPolicy {
  id: string;
  serviceKey: string;
  strategy:
    | "round-robin"
    | "least-connections"
    | "weighted"
    | "priority"
    | "region-aware";
  preferredRegion?: string;
  requiredTags: string[];
  fallbackEnabled: boolean;
  createdAt: string;
}

export interface CircuitBreakerState {
  id: string;
  serviceKey: string;
  state: "closed" | "open" | "half-open";
  failureCount: number;
  successCount: number;
  failureThreshold: number;
  recoveryTimeoutMs: number;
  openedAt?: string;
  updatedAt: string;
}

export interface RetryPolicy {
  id: string;
  serviceKey: string;
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoff: "fixed" | "linear" | "exponential";
  retryableStatuses: number[];
  enabled: boolean;
  createdAt: string;
}

export interface MeshRouteDecision {
  id: string;
  serviceKey: string;
  selectedInstanceId?: string;
  strategy: string;
  status: "routed" | "rejected" | "unavailable";
  reason: string;
  attempts: number;
  createdAt: string;
}

export interface ServiceHealthSnapshot {
  id: string;
  score: number;
  state: "healthy" | "degraded" | "critical";
  services: Array<{
    serviceKey: string;
    healthyInstances: number;
    totalInstances: number;
    averageHealthScore: number;
  }>;
  blockingIssues: string[];
  createdAt: string;
}

export interface ServiceObservation {
  id: string;
  serviceKey: string;
  instanceId?: string;
  metric:
    | "latency"
    | "throughput"
    | "error-rate"
    | "availability"
    | "connections"
    | "circuit-state";
  value: number;
  unit: string;
  metadata: Record<string, unknown>;
  recordedAt: string;
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