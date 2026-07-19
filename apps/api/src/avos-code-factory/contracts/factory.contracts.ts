export type FactoryLifecycleState =
  | "created"
  | "bootstrapping"
  | "ready"
  | "running"
  | "degraded"
  | "stopping"
  | "stopped"
  | "failed";

export type FactoryJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface FactoryCapabilityDescriptor {
  id: string;
  name: string;
  version: string;
  category: "kernel" | "runtime" | "workspace" | "registry" | "integration";
  enabled: boolean;
  dependencies: string[];
  metadata: Record<string, unknown>;
}

export interface FactoryExecutionStage {
  id: string;
  name: string;
  order: number;
  handler: string;
  timeoutMs: number;
  retryLimit: number;
  enabled: boolean;
}

export interface FactoryExecutionPlan {
  id: string;
  name: string;
  objective: string;
  stages: FactoryExecutionStage[];
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface FactoryExecutionResult {
  executionId: string;
  planId: string;
  status: FactoryJobStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  stageResults: FactoryStageResult[];
  output?: Record<string, unknown>;
  errors: FactoryExecutionError[];
}

export interface FactoryStageResult {
  stageId: string;
  stageName: string;
  status: FactoryJobStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  output?: Record<string, unknown>;
  error?: FactoryExecutionError;
}

export interface FactoryExecutionError {
  code: string;
  message: string;
  stageId?: string;
  details?: Record<string, unknown>;
}

export interface FactoryHealthReport {
  status: "healthy" | "degraded" | "unhealthy";
  lifecycleState: FactoryLifecycleState;
  uptimeSeconds: number;
  capabilities: {
    total: number;
    enabled: number;
    disabled: number;
  };
  runtime: {
    activeExecutions: number;
    completedExecutions: number;
    failedExecutions: number;
  };
  generatedAt: string;
}
