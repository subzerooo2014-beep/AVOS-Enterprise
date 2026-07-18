export type GeneratorLifecycleStatus =
  | "registered"
  | "validated"
  | "ready"
  | "running"
  | "suspended"
  | "failed"
  | "retired";

export type GeneratorExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface GeneratorDescriptor {
  id: string;
  name: string;
  version: string;
  kind: string;
  supportedTargets: string[];
  capabilities: string[];
  status: GeneratorLifecycleStatus;
  certified: boolean;
  maxRetries: number;
  metadata: Record<string, unknown>;
}

export interface GeneratorExecutionRequest {
  generatorId: string;
  planId: string;
  stageId: string;
  target: string;
  payload?: Record<string, unknown>;
  requestedBy: string;
}

export interface GeneratorExecutionContext {
  executionId: string;
  generatorId: string;
  planId: string;
  stageId: string;
  target: string;
  attempt: number;
  maxRetries: number;
  requestedBy: string;
  startedAt: string;
}

export interface GeneratedArtifact {
  id: string;
  executionId: string;
  generatorId: string;
  type: string;
  name: string;
  contentHash: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface GeneratorExecutionRecord {
  id: string;
  request: GeneratorExecutionRequest;
  context: GeneratorExecutionContext;
  status: GeneratorExecutionStatus;
  artifacts: GeneratedArtifact[];
  logs: string[];
  error?: string;
  completedAt?: string;
}

export interface GeneratorRuntimeMetrics {
  registeredGenerators: number;
  certifiedGenerators: number;
  totalExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  successRate: number;
  artifactsProduced: number;
}

export interface GeneratorRuntimeStatus {
  system: "AVOS Factory";
  megaPack: 6;
  component: "Generator Runtime";
  status: "healthy";
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  features: string[];
  metrics: GeneratorRuntimeMetrics;
}
