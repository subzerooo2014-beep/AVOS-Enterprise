export type PlatformRuntimeStatus =
  | "registered"
  | "bootstrapping"
  | "running"
  | "degraded"
  | "stopped"
  | "certified";

export interface PlatformRuntimeComponent {
  id: string;
  key:
    | "platform-runtime"
    | "foundation-control-plane"
    | "enterprise-kernel"
    | "capability-runtime"
    | "knowledge-runtime"
    | "intelligence-runtime"
    | "event-runtime"
    | "blueprint-runtime"
    | "genome-runtime";
  name: string;
  version: string;
  status: PlatformRuntimeStatus;
  required: boolean;
  dependencies: string[];
  capabilities: string[];
  healthScore: number;
  lastHeartbeatAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformRuntimeSession {
  id: string;
  runtimeId: string;
  environment: "development" | "test" | "staging" | "production";
  status: "created" | "active" | "completed" | "failed";
  contextId: string;
  startedBy: string;
  startedAt: string;
  endedAt?: string;
}

export interface PlatformRuntimeContext {
  id: string;
  environment: string;
  correlationId: string;
  tenantId?: string;
  organizationId?: string;
  locale: string;
  timezone: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PlatformRuntimeConfiguration {
  id: string;
  environment: string;
  version: string;
  values: Record<string, unknown>;
  immutableKeys: string[];
  approvedBy?: string;
  active: boolean;
  createdAt: string;
}

export interface PlatformRuntimeMetric {
  id: string;
  runtimeId: string;
  name:
    | "availability"
    | "latency"
    | "throughput"
    | "error-rate"
    | "cpu"
    | "memory"
    | "dependency-health";
  value: number;
  unit: string;
  recordedAt: string;
}

export interface PlatformRuntimeHealth {
  id: string;
  score: number;
  state: "healthy" | "degraded" | "critical";
  components: Array<{
    runtimeId: string;
    healthScore: number;
    status: PlatformRuntimeStatus;
    required: boolean;
  }>;
  blockingIssues: string[];
  createdAt: string;
}

export interface PlatformRuntimeCommand {
  id: string;
  command:
    | "bootstrap"
    | "start"
    | "stop"
    | "restart"
    | "discover"
    | "health-check"
    | "synchronize";
  runtimeIds: string[];
  requestedBy: string;
  requiresHumanApproval: boolean;
  approvedBy?: string;
  status: "queued" | "running" | "completed" | "failed";
  results: Array<{
    runtimeId: string;
    success: boolean;
    message: string;
  }>;
  createdAt: string;
  completedAt?: string;
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