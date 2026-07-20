export type IntegrationKind =
  | "internal"
  | "external"
  | "runtime";

export type IntegrationStatus =
  | "registered"
  | "active"
  | "degraded"
  | "suspended";

export type DeploymentStrategy =
  | "rolling"
  | "blue-green"
  | "canary";

export interface IntegrationDescriptor {
  id: string;
  key: string;
  name: string;
  kind: IntegrationKind;
  version: string;
  endpoint?: string;
  capabilities: string[];
  status: IntegrationStatus;
  healthScore: number;
  metadata: Record<string, string>;
  registeredAt: string;
  updatedAt: string;
}

export interface IntegrationExecution {
  id: string;
  integrationKey: string;
  operation: string;
  correlationId: string;
  request: unknown;
  response?: unknown;
  success: boolean;
  durationMs: number;
  error?: string;
  executedAt: string;
}

export interface EventEnvelope {
  id: string;
  type: string;
  source: string;
  subject: string;
  correlationId: string;
  payload: unknown;
  metadata: Record<string, string>;
  occurredAt: string;
}

export interface WorkflowRequest {
  id: string;
  workflowKey: string;
  tenantId?: string;
  input: unknown;
  status: "queued" | "running" | "completed" | "failed";
  result?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectorDefinition {
  id: string;
  key: string;
  category: string;
  provider: string;
  version: string;
  operations: string[];
  status: IntegrationStatus;
  configurationSchema: Record<string, unknown>;
  registeredAt: string;
}

export interface EnvironmentProfile {
  id: string;
  name: string;
  stage: "development" | "testing" | "staging" | "production";
  variables: Record<string, string>;
  featureFlags: Record<string, boolean>;
  secretReferences: Record<string, string>;
  scaling: {
    minReplicas: number;
    maxReplicas: number;
    cpuTarget: number;
    memoryTarget: number;
  };
  updatedAt: string;
}

export interface DeploymentRecord {
  id: string;
  releaseVersion: string;
  environment: string;
  strategy: DeploymentStrategy;
  status:
    | "planned"
    | "approved"
    | "deploying"
    | "completed"
    | "rolled-back"
    | "failed";
  approvedBy?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface RuntimeBenchmark {
  id: string;
  throughputPerSecond: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  errorRate: number;
  concurrency: number;
  score: number;
  measuredAt: string;
}

export interface ProductionCertificationScores {
  enterpriseIntegrationScore: number;
  externalIntegrationScore: number;
  connectorReadinessScore: number;
  eventBackboneScore: number;
  workflowIntegrationScore: number;
  runtimeReadinessScore: number;
  deploymentReadinessScore: number;
  observabilityScore: number;
  migrationReadinessScore: number;
  disasterRecoveryScore: number;
  verificationScore: number;
  smokeScore: number;
  finalProductionPlatformScore: number;
}