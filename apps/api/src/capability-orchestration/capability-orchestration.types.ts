export type CapabilityOrchestrationNodeMode =
  | "SEQUENTIAL"
  | "PARALLEL"
  | "CONDITIONAL"
  | "FALLBACK"
  | "COMPENSATION";

export type CapabilityOrchestrationStatus =
  | "DRAFT"
  | "VALIDATED"
  | "ACTIVE"
  | "PAUSED"
  | "FAILED"
  | "COMPLETED"
  | "ARCHIVED";

export type CapabilityRouteStrategy =
  | "FIRST_MATCH"
  | "HIGHEST_PRIORITY"
  | "HEALTHIEST"
  | "ROUND_ROBIN"
  | "WEIGHTED"
  | "AI_ASSISTED";

export interface CapabilityOrchestrationNode {
  id: string;
  capabilityKey: string;
  operation: string;
  mode: CapabilityOrchestrationNodeMode;
  dependsOn: string[];
  condition?: string;
  fallbackNodeIds?: string[];
  compensationNodeId?: string;
  timeoutMs?: number;
  retryCount?: number;
  optional?: boolean;
  inputMapping?: Record<string, string>;
  outputMapping?: Record<string, string>;
}

export interface CapabilityOrchestrationDefinition {
  id: string;
  key: string;
  name: string;
  version: string;
  description: string;
  owner: string;
  status: CapabilityOrchestrationStatus;
  nodes: CapabilityOrchestrationNode[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityRouteCandidate {
  capabilityKey: string;
  operation: string;
  priority: number;
  weight: number;
  tags: string[];
  requiredHealth: "HEALTHY" | "DEGRADED_ALLOWED";
}

export interface CapabilityRouteDefinition {
  id: string;
  routeKey: string;
  strategy: CapabilityRouteStrategy;
  candidates: CapabilityRouteCandidate[];
  fallbackCapabilityKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityDiscoveryQuery {
  kind?: string;
  tags?: string[];
  lifecycleStage?: string;
  operationalStatus?: string;
  requiresContractType?: string;
  minimumVersion?: string;
  limit?: number;
}

export interface CapabilityDiscoveryResult {
  capabilityKey: string;
  name: string;
  kind: string;
  version: string;
  lifecycleStage: string;
  operationalStatus: string;
  tags: string[];
  score: number;
  reasons: string[];
}

export interface CapabilityExecutionPlanNode {
  nodeId: string;
  capabilityKey: string;
  operation: string;
  stage: number;
  mode: CapabilityOrchestrationNodeMode;
  dependencies: string[];
  optional: boolean;
}

export interface CapabilityExecutionPlan {
  orchestrationId: string;
  orchestrationKey: string;
  version: string;
  stages: CapabilityExecutionPlanNode[][];
  totalNodes: number;
  parallelizableNodes: number;
  fallbackNodes: number;
  generatedAt: string;
}

export interface CapabilityOrchestrationExecutionRequest {
  orchestrationKey: string;
  payload?: unknown;
  tenantId?: string;
  environment?: string;
  correlationId?: string;
}

export interface CapabilityOrchestrationNodeResult {
  nodeId: string;
  capabilityKey: string;
  operation: string;
  success: boolean;
  skipped: boolean;
  fallbackUsed: boolean;
  durationMs: number;
  output?: unknown;
  error?: string;
}

export interface CapabilityOrchestrationExecutionResult {
  success: boolean;
  executionId: string;
  orchestrationKey: string;
  correlationId: string;
  status: CapabilityOrchestrationStatus;
  durationMs: number;
  nodeResults: CapabilityOrchestrationNodeResult[];
  output?: unknown;
  error?: string;
  startedAt: string;
  completedAt: string;
}

export interface CapabilityOrchestrationSnapshot {
  definitions: number;
  activeDefinitions: number;
  routes: number;
  executions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionDurationMs: number;
  composedNodes: number;
  generatedAt: string;
}