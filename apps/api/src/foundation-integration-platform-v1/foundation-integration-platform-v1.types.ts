export interface FoundationIntegrationModuleV1 {
  id: string;
  name: string;
  version: string;
  status: "REGISTERED" | "READY" | "DEGRADED" | "OFFLINE";
  dependencies: string[];
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoundationIntegrationCapabilityV1 {
  id: string;
  name: string;
  ownerModuleId: string;
  status: "AVAILABLE" | "DEGRADED" | "UNAVAILABLE";
  dependencies: string[];
  updatedAt: string;
}

export interface FoundationBootstrapStepV1 {
  id: string;
  name: string;
  order: number;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  dependencies: string[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface FoundationIntegrationEventV1 {
  id: string;
  topic: string;
  source: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface FoundationExecutionRequestV1 {
  id: string;
  workflow: string;
  rules: string[];
  policy: string;
  aiTask?: string;
  context: Record<string, unknown>;
  status: "CREATED" | "RUNNING" | "COMPLETED" | "DENIED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  result?: Record<string, unknown>;
  error?: string;
}

export interface FoundationHealthComponentV1 {
  id: string;
  name: string;
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  score: number;
  details: string[];
  checkedAt: string;
}

export interface FoundationIntegrationMetricsV1 {
  modules: number;
  readyModules: number;
  capabilities: number;
  availableCapabilities: number;
  bootstrapSteps: number;
  completedBootstrapSteps: number;
  events: number;
  executionRequests: number;
  completedExecutions: number;
  failedExecutions: number;
  healthComponents: number;
  unhealthyComponents: number;
}

export interface FoundationIntegrationStatusV1 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: FoundationIntegrationMetricsV1;
  components: Record<string, string>;
}
