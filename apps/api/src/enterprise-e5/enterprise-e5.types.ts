export type EnterpriseCommandStatus =
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface EnterpriseCommand {
  id: string;
  name: string;
  payload: Record<string, unknown>;
  status: EnterpriseCommandStatus;
  attempts: number;
  createdAt: string;
  completedAt?: string;
  failedAt?: string;
}

export interface EnterpriseEvent {
  id: string;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  publishedAt: string;
}

export interface EnterpriseJob {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  executions: number;
  lastRunAt?: string;
}

export interface EnterpriseCircuitSnapshot {
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  failures: number;
  threshold: number;
  lastFailureAt?: string;
}

export interface EnterpriseRuntimeSnapshot {
  commands: number;
  events: number;
  jobs: number;
  cacheEntries: number;
  discoveredServices: number;
  healthyServices: number;
  generatedAt: string;
}