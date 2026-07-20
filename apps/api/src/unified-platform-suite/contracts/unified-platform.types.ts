export type PlatformLifecycleState =
  | "created"
  | "booting"
  | "operational"
  | "degraded"
  | "stopping"
  | "stopped"
  | "failed";

export type UltraSuiteId =
  | "marketplace"
  | "media"
  | "finance"
  | "enterprise-brain"
  | "global-intelligence";

export interface PlatformComponentRecord {
  id: string;
  type: "suite" | "service" | "engine" | "controller" | "api" | "workflow" | "event-channel";
  name: string;
  version: string;
  status: "registered" | "operational" | "degraded" | "offline";
  endpoint?: string;
  capabilities: string[];
  metadata: Record<string, unknown>;
  registeredAt: string;
  updatedAt: string;
}

export interface PlatformEvent<T = unknown> {
  id: string;
  type: string;
  source: string;
  payload: T;
  occurredAt: string;
  correlationId?: string;
  replayed?: boolean;
}

export interface WorkflowStep {
  id: string;
  suite: UltraSuiteId;
  action: string;
  dependsOn?: string[];
  requiresHumanApproval?: boolean;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  mode: "long-running" | "parallel" | "distributed" | "human-approval" | "recovery";
  steps: WorkflowStep[];
}

export interface GovernanceDecision {
  id: string;
  action: string;
  allowed: boolean;
  requiresHumanApproval: boolean;
  reasons: string[];
  evaluatedAt: string;
}