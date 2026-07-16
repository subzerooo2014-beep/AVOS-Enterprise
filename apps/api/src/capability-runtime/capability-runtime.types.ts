export type CapabilityRuntimeState =
  | "UNLOADED"
  | "LOADING"
  | "READY"
  | "ACTIVE"
  | "DEGRADED"
  | "SUSPENDED"
  | "FAILED"
  | "STOPPED";

export type CapabilityRuntimeIsolation =
  | "SHARED_PROCESS"
  | "ISOLATED_CONTEXT"
  | "WORKER"
  | "EXTERNAL";

export interface CapabilityRuntimeResourcePolicy {
  maxConcurrency: number;
  maxQueueDepth: number;
  timeoutMs: number;
  maxMemoryMb: number;
  cpuWeight: number;
  priority: number;
}

export interface CapabilityRuntimeLoadRequest {
  capabilityKey: string;
  tenantId?: string;
  environment?: string;
  lazy?: boolean;
  isolation?: CapabilityRuntimeIsolation;
  configuration?: Record<string, unknown>;
  resourcePolicy?: Partial<CapabilityRuntimeResourcePolicy>;
}

export interface CapabilityRuntimeContext {
  runtimeId: string;
  capabilityKey: string;
  tenantId: string;
  environment: string;
  correlationId: string;
  isolation: CapabilityRuntimeIsolation;
  configuration: Record<string, unknown>;
  resourcePolicy: CapabilityRuntimeResourcePolicy;
  createdAt: string;
}

export interface CapabilityRuntimeInstance {
  runtimeId: string;
  capabilityKey: string;
  capabilityVersion: string;
  state: CapabilityRuntimeState;
  tenantId: string;
  environment: string;
  isolation: CapabilityRuntimeIsolation;
  lazy: boolean;
  loadedAt?: string;
  activatedAt?: string;
  suspendedAt?: string;
  stoppedAt?: string;
  restartCount: number;
  failureCount: number;
  lastError?: string;
  health: CapabilityRuntimeHealth;
  resources: CapabilityRuntimeResourceSnapshot;
  diagnostics: CapabilityRuntimeDiagnostic[];
  configuration: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityRuntimeHealth {
  status: "UNKNOWN" | "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  readiness: boolean;
  liveness: boolean;
  lastCheckedAt?: string;
  message?: string;
}

export interface CapabilityRuntimeResourceSnapshot {
  activeExecutions: number;
  queuedExecutions: number;
  peakConcurrency: number;
  totalExecutions: number;
  failedExecutions: number;
  averageDurationMs: number;
  estimatedMemoryMb: number;
}

export interface CapabilityRuntimeDiagnostic {
  id: string;
  level: "INFO" | "WARNING" | "ERROR";
  code: string;
  message: string;
  recordedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CapabilityRuntimeResolution {
  success: boolean;
  capabilityKey: string;
  capabilityVersion?: string;
  resolvedDependencies: string[];
  unresolvedDependencies: string[];
  blockedByCycles: boolean;
  cycles: string[][];
  reason?: string;
}

export interface CapabilityRuntimeExecutionRequest {
  runtimeId: string;
  operation: string;
  payload?: unknown;
  correlationId?: string;
}

export interface CapabilityRuntimeExecutionResult {
  success: boolean;
  runtimeId: string;
  operation: string;
  correlationId: string;
  durationMs: number;
  state: CapabilityRuntimeState;
  output?: unknown;
  error?: string;
}

export interface CapabilityRuntimeSnapshot {
  totalInstances: number;
  active: number;
  ready: number;
  degraded: number;
  suspended: number;
  failed: number;
  stopped: number;
  totalExecutions: number;
  failedExecutions: number;
  averageDurationMs: number;
  byIsolation: Record<string, number>;
  byCapability: Record<string, number>;
  generatedAt: string;
}